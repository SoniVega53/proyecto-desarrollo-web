package com.soni.proyecto_spring.proyecto_spring.model;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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

    @ManyToOne() 
    @JoinColumn(name = "id_usuario", nullable = false) 
    private UsuarioEntity usuario; 

    private String nombreMapa;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
}
