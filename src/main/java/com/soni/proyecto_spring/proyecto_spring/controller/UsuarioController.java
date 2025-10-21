package com.soni.proyecto_spring.proyecto_spring.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.soni.proyecto_spring.proyecto_spring.model.UsuarioEntity;
import com.soni.proyecto_spring.proyecto_spring.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {
    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public List<UsuarioEntity> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    @PostMapping
    public UsuarioEntity createUsuario(@RequestBody UsuarioEntity usuario) {
        return usuarioRepository.save(usuario);
    }

    @PutMapping("/{id}")
    public UsuarioEntity updateUsuario(@PathVariable Long id, @RequestBody UsuarioEntity usuarioDetails) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setNombre(usuarioDetails.getNombre());
            usuario.setCorreo(usuarioDetails.getCorreo());
            usuario.setPassword(usuarioDetails.getPassword());
            usuario.setRol(usuarioDetails.getRol());
            return usuarioRepository.save(usuario);
        }).orElse(null); 
    }

    @DeleteMapping("/{id}")
    public void deleteUsuario(@PathVariable Long id) {
        usuarioRepository.deleteById(id);
    }
}
