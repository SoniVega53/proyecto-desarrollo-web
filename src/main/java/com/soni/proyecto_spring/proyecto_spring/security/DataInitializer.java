package com.soni.proyecto_spring.proyecto_spring.security;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.soni.proyecto_spring.proyecto_spring.model.MapaDetalleEntity;
import com.soni.proyecto_spring.proyecto_spring.model.MapaEntity;
import com.soni.proyecto_spring.proyecto_spring.model.UsuarioEntity;
import com.soni.proyecto_spring.proyecto_spring.repository.MapaDetalleRepository;
import com.soni.proyecto_spring.proyecto_spring.repository.MapaRepository;
import com.soni.proyecto_spring.proyecto_spring.repository.UsuarioRepository;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UsuarioRepository usuarioRepository;
    private final MapaRepository mapaRepository;
    private final MapaDetalleRepository mapaDetalleRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void initData() {
        if (usuarioRepository.findByCorreo("admin@gmail.com").isEmpty()) {
            UsuarioEntity admin = new UsuarioEntity();
            admin.setNombre("admin");
            admin.setCorreo("admin@gmail.com");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRol("ADMIN");
            admin.setFechaCreacion(LocalDateTime.now());
            usuarioRepository.save(admin);

            List<MapaEntity> mapas = Arrays.asList(
                    new MapaEntity(null, admin, "Mapa 1", LocalDateTime.now()),
                    new MapaEntity(null, admin, "Mapa 2", LocalDateTime.now()),
                    new MapaEntity(null, admin, "Mapa 3", LocalDateTime.now()));
            mapaRepository.saveAll(mapas);
            
            MapaEntity mapa1 = mapaRepository.findByNombreMapa("Mapa 1").orElse(null);
            MapaEntity mapa2 = mapaRepository.findByNombreMapa("Mapa 2").orElse(null);
            MapaEntity mapa3 = mapaRepository.findByNombreMapa("Mapa 3").orElse(null);
            // =============== MAPA 1 ===============
            if (mapa1 != null) {
                List<MapaDetalleEntity> detalles1 = Arrays.asList(
                        new MapaDetalleEntity(null, 1, 0, "TOP_LEFT", 0, 0, true, mapa1),
                        new MapaDetalleEntity(null, 2, 1, "TOP", 0, 0, false, mapa1),
                        new MapaDetalleEntity(null, 3, 2, "TOP", 0, 0, false, mapa1),
                        new MapaDetalleEntity(null, 9, 2, "CENTER", 1, 0, false, mapa1),
                        new MapaDetalleEntity(null, 15, 2, "CENTER", 2, 0, false, mapa1),
                        new MapaDetalleEntity(null, 14, 1, "CENTER", 2, 0, false, mapa1),
                        new MapaDetalleEntity(null, 13, 0, "LEFT", 2, 0, false, mapa1),
                        new MapaDetalleEntity(null, 19, 0, "LEFT", 3, 0, false, mapa1),
                        new MapaDetalleEntity(null, 25, 0, "LEFT", 4, 0, false, mapa1),
                        new MapaDetalleEntity(null, 26, 1, "CENTER", 4, 0, false, mapa1),
                        new MapaDetalleEntity(null, 27, 2, "CENTER", 4, 0, false, mapa1),
                        new MapaDetalleEntity(null, 33, 2, "BOTTOM", 5, 0, false, mapa1),
                        new MapaDetalleEntity(null, 34, 3, "BOTTOM", 5, 0, false, mapa1),
                        new MapaDetalleEntity(null, 35, 4, "BOTTOM", 5, 0, false, mapa1),
                        new MapaDetalleEntity(null, 29, 4, "CENTER", 4, 0, false, mapa1),
                        new MapaDetalleEntity(null, 23, 4, "CENTER", 3, 0, false, mapa1),
                        new MapaDetalleEntity(null, 17, 4, "CENTER", 2, 0, false, mapa1),
                        new MapaDetalleEntity(null, 11, 4, "CENTER", 1, 0, false, mapa1),
                        new MapaDetalleEntity(null, 5, 4, "TOP", 0, 0, false, mapa1),
                        new MapaDetalleEntity(null, 6, 5, "TOP_RIGHT", 0, 0, false, mapa1));
                mapaDetalleRepository.saveAll(detalles1);
            }

            // =============== MAPA 2 ===============
            if (mapa2 != null) {
                List<MapaDetalleEntity> detalles2 = Arrays.asList(
                        new MapaDetalleEntity(null, 1, 0, "TOP_LEFT", 0, 0, true, mapa2),
                        new MapaDetalleEntity(null, 2, 1, "TOP", 0, 0, false, mapa2),
                        new MapaDetalleEntity(null, 3, 2, "TOP", 0, 0, false, mapa2),
                        new MapaDetalleEntity(null, 4, 3, "TOP", 0, 0, false, mapa2),
                        new MapaDetalleEntity(null, 5, 4, "TOP", 0, 0, false, mapa2),
                        new MapaDetalleEntity(null, 6, 5, "TOP_RIGHT", 0, 0, false, mapa2),
                        new MapaDetalleEntity(null, 12, 5, "RIGHT", 1, 0, false, mapa2),
                        new MapaDetalleEntity(null, 18, 5, "RIGHT", 2, 0, false, mapa2),
                        new MapaDetalleEntity(null, 24, 5, "RIGHT", 3, 0, false, mapa2),
                        new MapaDetalleEntity(null, 30, 5, "RIGHT", 4, 0, false, mapa2),
                        new MapaDetalleEntity(null, 36, 5, "BOTTOM_RIGHT", 5, 0, false, mapa2),
                        new MapaDetalleEntity(null, 35, 4, "BOTTOM", 5, 0, false, mapa2),
                        new MapaDetalleEntity(null, 34, 3, "BOTTOM", 5, 0, false, mapa2),
                        new MapaDetalleEntity(null, 28, 3, "CENTER", 4, 0, false, mapa2),
                        new MapaDetalleEntity(null, 22, 3, "CENTER", 3, 0, false, mapa2),
                        new MapaDetalleEntity(null, 16, 3, "CENTER", 2, 0, false, mapa2),
                        new MapaDetalleEntity(null, 15, 2, "CENTER", 2, 0, false, mapa2),
                        new MapaDetalleEntity(null, 14, 1, "CENTER", 2, 0, false, mapa2),
                        new MapaDetalleEntity(null, 20, 1, "CENTER", 3, 0, false, mapa2),
                        new MapaDetalleEntity(null, 26, 1, "CENTER", 4, 0, false, mapa2),
                        new MapaDetalleEntity(null, 32, 1, "BOTTOM", 5, 0, false, mapa2),
                        new MapaDetalleEntity(null, 31, 0, "BOTTOM_LEFT", 5, 0, false, mapa2));
                mapaDetalleRepository.saveAll(detalles2);
            }

            // =============== MAPA 3 ===============
            if (mapa3 != null) {
                List<MapaDetalleEntity> detalles3 = Arrays.asList(
                        new MapaDetalleEntity(null, 1, 0, "TOP_LEFT", 0, 0, true, mapa3),
                        new MapaDetalleEntity(null, 2, 1, "TOP", 0, 0, false, mapa3),
                        new MapaDetalleEntity(null, 3, 2, "TOP", 0, 0, false, mapa3),
                        new MapaDetalleEntity(null, 4, 3, "TOP", 0, 0, false, mapa3),
                        new MapaDetalleEntity(null, 5, 4, "TOP", 0, 0, false, mapa3),
                        new MapaDetalleEntity(null, 11, 4, "CENTER", 1, 0, false, mapa3),
                        new MapaDetalleEntity(null, 17, 4, "CENTER", 2, 0, false, mapa3),
                        new MapaDetalleEntity(null, 23, 4, "CENTER", 3, 0, false, mapa3),
                        new MapaDetalleEntity(null, 22, 3, "CENTER", 3, 0, false, mapa3),
                        new MapaDetalleEntity(null, 21, 2, "CENTER", 3, 0, false, mapa3),
                        new MapaDetalleEntity(null, 15, 2, "CENTER", 2, 0, false, mapa3),
                        new MapaDetalleEntity(null, 14, 1, "CENTER", 2, 0, false, mapa3),
                        new MapaDetalleEntity(null, 13, 0, "LEFT", 2, 0, false, mapa3),
                        new MapaDetalleEntity(null, 19, 0, "LEFT", 3, 0, false, mapa3),
                        new MapaDetalleEntity(null, 25, 0, "LEFT", 4, 0, false, mapa3),
                        new MapaDetalleEntity(null, 31, 0, "BOTTOM_LEFT", 5, 0, false, mapa3),
                        new MapaDetalleEntity(null, 32, 1, "BOTTOM", 5, 0, false, mapa3),
                        new MapaDetalleEntity(null, 33, 2, "BOTTOM", 5, 0, false, mapa3),
                        new MapaDetalleEntity(null, 34, 3, "BOTTOM", 5, 0, false, mapa3),
                        new MapaDetalleEntity(null, 35, 4, "BOTTOM", 5, 0, false, mapa3));
                mapaDetalleRepository.saveAll(detalles3);
            }

            System.out.println("Datos iniciales insertados correctamente.");
        } else {
            System.out.println("ℹDatos iniciales ya existen, no se insertaron nuevamente.");
        }
    }
}
