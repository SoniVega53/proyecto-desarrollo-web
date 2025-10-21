package com.soni.proyecto_spring.proyecto_spring.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MapaModel {

    private Long idMapa;
    private String nombreMapa;
}
