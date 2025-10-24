package com.soni.proyecto_spring.proyecto_spring.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.soni.proyecto_spring.proyecto_spring.model.MapaDetalleEntity;

public interface MapaDetalleRepository extends JpaRepository<MapaDetalleEntity, Long>{
    List<MapaDetalleEntity> findByMapaIdMapa(Long idMapa);
    
}
