package com.soni.proyecto_spring.proyecto_spring.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.soni.proyecto_spring.proyecto_spring.model.MapaDetalleEntity;
import com.soni.proyecto_spring.proyecto_spring.model.MapaDetalleModel;
import com.soni.proyecto_spring.proyecto_spring.model.MapaEntity;
import com.soni.proyecto_spring.proyecto_spring.model.UsuarioEntity;
import com.soni.proyecto_spring.proyecto_spring.repository.MapaDetalleRepository;
import com.soni.proyecto_spring.proyecto_spring.repository.MapaRepository;
import com.soni.proyecto_spring.proyecto_spring.repository.UsuarioRepository;
import com.soni.proyecto_spring.proyecto_spring.security.JwtTokenProvider;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtProvider;
    private final MapaRepository mapaRepository;
    private final MapaDetalleRepository mapaDetalleRepository;

    @GetMapping
    public List<UsuarioEntity> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    @PostMapping("/validar-token")
    public ResponseEntity<?> validarToken(@RequestParam String token) {
        if (!jwtProvider.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Token inválido o expirado");
        }
        return ResponseEntity.ok("Token válido");
    }

    @PostMapping("/register")
    public String registrar(@RequestBody UsuarioEntity usuario) {
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setFechaCreacion(LocalDateTime.now());
        usuarioRepository.save(usuario);
        return "Usuario registrado correctamente";
    }

    @GetMapping("/{id}")
    public UsuarioEntity getUsuarioById(@PathVariable Long id) {
        Optional<UsuarioEntity> usuario = usuarioRepository.findById(id);
        return usuario.orElse(null);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestParam String correo,
            @RequestParam String password) {
        try {
            UsuarioEntity usuario = usuarioRepository.findByCorreo(correo)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            if (!passwordEncoder.matches(password, usuario.getPassword())) {
                throw new RuntimeException("Credenciales inválidas");
            }

            String token = jwtProvider.generarToken(correo, usuario.getRol());

            return ResponseEntity.ok(Map.of("token", token));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }

    @GetMapping("/aletorioMapa")
    public List<MapaDetalleModel> getMapaAletorioMapa() {
        List<MapaEntity> mapas = mapaRepository.findAll();

        int indiceAleatorio = new Random().nextInt(mapas.size());
        MapaEntity mapaSeleccionado = mapas.get(indiceAleatorio);

        List<MapaDetalleEntity> listadoPasos = mapaDetalleRepository.findByMapaIdMapa(mapaSeleccionado.getIdMapa());
        List<MapaDetalleModel> seListadoPa = new ArrayList<>();
        for (MapaDetalleEntity entity : listadoPasos) {
            seListadoPa.add(new MapaDetalleModel(entity.getCeldaKey(), entity.getCeldaValue(),
                    entity.getTipo(), entity.getValueMain(), entity.getEstatus(), entity.isStart()));
        }

        return seListadoPa;
    }
}
