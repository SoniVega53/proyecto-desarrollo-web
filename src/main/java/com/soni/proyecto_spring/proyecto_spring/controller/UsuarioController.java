package com.soni.proyecto_spring.proyecto_spring.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public List<UsuarioEntity> getAllUsuarios() {
        return usuarioRepository.findAll();
    }
    @GetMapping("/{correo}")
    public UsuarioEntity getUsuariosByCorreo(@PathVariable String correo) {
        return usuarioRepository.findByCorreo(correo).get();
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

    @PostMapping("/updatePassword/{correo}/{password}/{passwordChange}")
    public ResponseEntity<?> updateUsuarioPassword(@PathVariable String correo, @PathVariable String password,
            @PathVariable String passwordChange) {
        try {
            UsuarioEntity usuario = usuarioRepository.findByCorreo(correo)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            if (usuario != null) {
                if (password != null && passwordChange != null &&
                        !password.isEmpty() && !passwordChange.isEmpty()) {

                    if (checkPassword(password, usuario.getPassword())) {
                        usuario.setPassword(passwordEncoder.encode(passwordChange));
                        usuarioRepository.save(usuario);

                        return ResponseEntity.ok("Se cambio correctamente");
                    }
                }
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Contraseña no es valida");
            }
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        try {
            return passwordEncoder.matches(rawPassword.trim(), encodedPassword);
        } catch (Exception e) {
            return false;
        }
    }
}
