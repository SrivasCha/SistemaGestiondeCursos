package com.sistema.modelo;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "alquiler")
public class Alquiler {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alquiler")
    private Long idAlquiler;

    @Column(name = "fecha_alquiler", nullable = false)
    private LocalDate fechaAlquiler;

    @Column(name = "fecha_devolucion_esperada")
    private LocalDate fechaDevolucionEsperada;

    @Column(name = "fecha_devolucion") 
    private LocalDate fechaDevolucion;

    @Column(name = "importe_total", nullable = false, precision = 10, scale = 2) 
    private BigDecimal importeTotal; 

    @Column(name = "estado", nullable = false)
    private String estado;
    
    @JsonIgnoreProperties({"alquileresRegistrados", "handler", "hibernateLazyInitializer"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_empleado")
    private Empleado empleado; 

    @JsonIgnoreProperties({"alquileres", "handler", "hibernateLazyInitializer"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @JsonIgnoreProperties({"alquileres", "handler", "hibernateLazyInitializer"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_copia", nullable = false)
    private Copia copia;
    
    public Alquiler() {
        this.estado = "Activo";
        this.importeTotal = BigDecimal.ZERO;
    }

    public Alquiler(LocalDate fechaAlquiler, Cliente cliente, Copia copia, Empleado empleado) {
        this.fechaAlquiler = fechaAlquiler;
        this.cliente = cliente;
        this.copia = copia;
        this.empleado = empleado;
        this.estado = "Activo";
        this.importeTotal = BigDecimal.ZERO;
    }

    // Getters y Setters
    public Long getIdAlquiler() { return idAlquiler; }
    public void setIdAlquiler(Long idAlquiler) { this.idAlquiler = idAlquiler; }
    
    public LocalDate getFechaAlquiler() { return fechaAlquiler; }
    public void setFechaAlquiler(LocalDate fechaAlquiler) { 
        this.fechaAlquiler = fechaAlquiler;
    }
    
    public LocalDate getFechaDevolucionEsperada() { return fechaDevolucionEsperada; }
    public void setFechaDevolucionEsperada(LocalDate fechaDevolucionEsperada) { 
        this.fechaDevolucionEsperada = fechaDevolucionEsperada; 
    }
    
    public LocalDate getFechaDevolucion() { return fechaDevolucion; }
    public void setFechaDevolucion(LocalDate fechaDevolucion) { 
        this.fechaDevolucion = fechaDevolucion;
        if (fechaDevolucion != null) {
            this.estado = "Finalizado";
        }
    }
    
    public BigDecimal getImporteTotal() { return importeTotal; }
    public void setImporteTotal(BigDecimal importeTotal) { this.importeTotal = importeTotal; }
    
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    
    public Copia getCopia() { return copia; }
    public void setCopia(Copia copia) { 
        this.copia = copia;
    }
    
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    
    public Empleado getEmpleado() { return empleado; }
    public void setEmpleado(Empleado empleado) { this.empleado = empleado; }

    /**
     * Calcula la fecha de devolución esperada basada en los días de préstamo de la tarifa
     */
    public void calcularFechaDevolucionEsperada() {
        if (this.fechaAlquiler == null) {
            System.out.println("No se puede calcular: fechaAlquiler es null");
            return;
        }
        
        if (this.copia == null) {
            System.out.println("No se puede calcular: copia es null");
            return;
        }
        
        if (this.copia.getPelicula() == null) {
            System.out.println("No se puede calcular: pelicula es null");
            return;
        }
        
        if (this.copia.getPelicula().getTarifa() == null) {
            System.out.println("No se puede calcular: tarifa es null");
            return;
        }

        Tarifa tarifa = this.copia.getPelicula().getTarifa();
        Integer diasPrestamo = tarifa.getDiasPrestamo() != null ? tarifa.getDiasPrestamo() : 3;
        this.fechaDevolucionEsperada = this.fechaAlquiler.plusDays(diasPrestamo);
        
        System.out.println("Fecha devolución esperada calculada: " + this.fechaDevolucionEsperada + " (+" + diasPrestamo + " días)");
    }

    /**
     * Calcula el importe total del alquiler
     * - Al crear: solo el precio base
     * - Al devolver: precio base + penalización por días extra
     */
    public BigDecimal calcularImporte() {
        if (this.copia == null || 
            this.copia.getPelicula() == null || 
            this.copia.getPelicula().getTarifa() == null) 
        {
            System.out.println("No se puede calcular importe: datos incompletos");
            this.importeTotal = BigDecimal.ZERO;
            return this.importeTotal;
        }

        Tarifa tarifa = this.copia.getPelicula().getTarifa();
        
        BigDecimal precioBase = tarifa.getPrecio() != null ? tarifa.getPrecio() : BigDecimal.ZERO;
        
        // Inicialmente solo cobramos el precio base
        this.importeTotal = precioBase;
        
        System.out.println("Precio base: " + precioBase);

        // Si hay devolución, calculamos penalización por mora
        if (this.fechaDevolucion != null && this.fechaDevolucionEsperada != null) {
            
            long diasRetraso = ChronoUnit.DAYS.between(this.fechaDevolucionEsperada, this.fechaDevolucion);
            
            System.out.println("Calculando penalización - Días de retraso: " + diasRetraso);
            
            if (diasRetraso > 0) {
                BigDecimal penalizacionDiaria = tarifa.getPenalizacionDiaria() != null 
                    ? tarifa.getPenalizacionDiaria() 
                    : BigDecimal.ZERO;
                
                BigDecimal cargoPenalizacion = penalizacionDiaria.multiply(BigDecimal.valueOf(diasRetraso));
                this.importeTotal = precioBase.add(cargoPenalizacion);
                
                System.out.println("Penalización aplicada: " + cargoPenalizacion + " = " + penalizacionDiaria + " x " + diasRetraso + " días");
                System.out.println("Importe total: " + this.importeTotal);
            }
        }
        
        return this.importeTotal;
    }

    @Override
    public String toString() {
        return "Alquiler{" +
                "idAlquiler=" + idAlquiler +
                ", fechaAlquiler=" + fechaAlquiler +
                ", fechaDevolucionEsperada=" + fechaDevolucionEsperada +
                (fechaDevolucion != null ? ", fechaDevolucion=" + fechaDevolucion : "") +
                ", importeTotal=" + importeTotal +
                ", estado='" + estado + '\'' +
                ", clienteId=" + (cliente != null ? cliente.getId() : "null") +
                ", copiaId=" + (copia != null ? copia.getIdCopia() : "null") +
                ", empleadoId=" + (empleado != null ? empleado.getId() : "null") +
                '}';
    }
}