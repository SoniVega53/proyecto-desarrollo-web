package com.soni.proyecto_spring.proyecto_spring.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.soni.proyecto_spring.proyecto_spring.model.MapaActualizarModel;
import com.soni.proyecto_spring.proyecto_spring.model.MapaDetalleEntity;
import com.soni.proyecto_spring.proyecto_spring.model.MapaDetalleModel;
import com.soni.proyecto_spring.proyecto_spring.model.MapaEntity;
import com.soni.proyecto_spring.proyecto_spring.model.MapaModel;
import com.soni.proyecto_spring.proyecto_spring.model.UsuarioEntity;
import com.soni.proyecto_spring.proyecto_spring.repository.MapaDetalleRepository;
import com.soni.proyecto_spring.proyecto_spring.repository.MapaRepository;
import com.soni.proyecto_spring.proyecto_spring.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/mapas")
@RequiredArgsConstructor
public class MapaController {

    private final MapaRepository mapaRepository;
    private final MapaDetalleRepository mapaDetalleRepository;
    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public List<MapaEntity> getAllMapas() {
        return mapaRepository.findAll();
    }

    @GetMapping("/detalles/{idMapa}")
    public MapaActualizarModel getPasosMapas(@PathVariable Long idMapa) {
        MapaEntity mapa = mapaRepository.findById(idMapa).orElse(null);

        if (mapa != null) {
            List<MapaDetalleEntity> listadoPasos = mapaDetalleRepository.findByMapaIdMapa(mapa.getIdMapa());
            List<MapaDetalleModel> newListadoPasos = new ArrayList<>();

            for (MapaDetalleEntity entity : listadoPasos) {
                newListadoPasos.add(new MapaDetalleModel(entity.getCeldaKey(), entity.getCeldaValue(),
                        entity.getTipo(), entity.getValueMain(), entity.getEstatus(), entity.isStart()));
            }
            MapaModel data = new MapaModel(mapa.getIdMapa(), mapa.getNombreMapa());
            return new MapaActualizarModel(data, newListadoPasos);
        }

        return null;
    }

    @GetMapping("/detalles")
    public List<MapaActualizarModel> getPasosMapas() {
        List<MapaEntity> mapas = mapaRepository.findAll();
        List<MapaActualizarModel> seListadoPa = new ArrayList<>();

        mapas.forEach(data -> {
            List<MapaDetalleEntity> listadoPasos = mapaDetalleRepository.findByMapaIdMapa(data.getIdMapa());
            List<MapaDetalleModel> newListadoPasos = new ArrayList<>();

            for (MapaDetalleEntity entity : listadoPasos) {
                newListadoPasos.add(new MapaDetalleModel(entity.getCeldaKey(), entity.getCeldaValue(),
                        entity.getTipo(), entity.getValueMain(), entity.getEstatus(), entity.isStart()));
            }

            MapaModel mapa = new MapaModel(data.getIdMapa(), data.getNombreMapa());

            seListadoPa.add(new MapaActualizarModel(mapa, newListadoPasos));
        });

        return seListadoPa;
    }

    @PostMapping("/{correo}")
    public ResponseEntity<?> createMapa(@PathVariable String correo, @RequestBody MapaActualizarModel data) {
        try {
            Optional<UsuarioEntity> usuarioOpt = usuarioRepository.findByCorreo(correo);
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Usuario no encontrado"));
            }

            UsuarioEntity usuario = usuarioOpt.get();
            MapaEntity mapaExistente = null;

            if (data.getMapa().getIdMapa() != null) {
                mapaExistente = mapaRepository.findById(data.getMapa().getIdMapa()).orElse(null);

                if (mapaExistente != null) {
                    List<MapaDetalleEntity> detallesAntiguos = mapaDetalleRepository
                            .findByMapaIdMapa(mapaExistente.getIdMapa());

                    mapaDetalleRepository.deleteAll(detallesAntiguos);
                }
            }

            Long idMapa = mapaExistente != null ? mapaExistente.getIdMapa() : null;
            MapaEntity nuevoMapa = new MapaEntity(
                    idMapa,
                    usuario,
                    data.getMapa().getNombreMapa(),
                    LocalDateTime.now());

            MapaEntity mapaGuardado = mapaRepository.save(nuevoMapa);

            for (MapaDetalleModel item : data.getDetalles()) {
                MapaDetalleEntity detalle = new MapaDetalleEntity(
                        null,
                        item.getKey(),
                        item.getValue(),
                        item.getTipo(),
                        item.getValueMain(),
                        item.getEstatus(),
                        item.isStart(),
                        mapaGuardado);
                mapaDetalleRepository.save(detalle);
            }

            return ResponseEntity
                    .status(idMapa == null ? HttpStatus.CREATED : HttpStatus.OK)
                    .body(mapaGuardado);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public void deleteMapa(@PathVariable Long id) {
        mapaRepository.deleteById(id);
    }

}
