package com.soni.proyecto_spring.proyecto_spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.soni.proyecto_spring.proyecto_spring.model.UsuarioEntity;

public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Long>{

}
