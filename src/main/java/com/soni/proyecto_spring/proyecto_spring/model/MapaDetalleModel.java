package com.soni.proyecto_spring.proyecto_spring.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MapaDetalleModel {
    private Long idMapa;

    private int key;
    private int value;
    private String tipo;
    private int valueMain;
    private int estatus;
    private boolean start;
}
