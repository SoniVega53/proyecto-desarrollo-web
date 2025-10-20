package com.soni.proyecto_spring.proyecto_spring.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MapaActualizarModel {

    private MapaEntity mapa;
    private List<MapaDetalleModel> detalles;
}
