package com.soni.proyecto_spring.proyecto_spring.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "mapa_detalle")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MapaDetalleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDetalle;

    private int celdaKey;
    private int celdaValue;
    private String tipo;
    private int valueMain;
    private int estatus;
    private boolean start;

    @ManyToOne
    @JoinColumn(name = "id_mapa")
    private MapaEntity mapa;

}
