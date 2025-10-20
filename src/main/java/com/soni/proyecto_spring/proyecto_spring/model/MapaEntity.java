package com.soni.proyecto_spring.proyecto_spring.model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "mapas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MapaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMapa;

    private String nombreMapa;

    // @OneToMany(mappedBy = "mapa", cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<MapaDetalleEntity> detalles;
}
