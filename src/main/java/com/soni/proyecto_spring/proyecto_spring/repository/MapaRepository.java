package com.soni.proyecto_spring.proyecto_spring.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.soni.proyecto_spring.proyecto_spring.model.MapaEntity;


public interface MapaRepository extends JpaRepository<MapaEntity, Long>{
      Optional<MapaEntity> findByNombreMapa(String nombreMapa);
}
