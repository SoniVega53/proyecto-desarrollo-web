package com.soni.proyecto_spring.proyecto_spring.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Random;

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
    public MapaEntity createMapa(@PathVariable String correo, @RequestBody MapaActualizarModel data) {
        try {
            UsuarioEntity usuario = usuarioRepository.findByCorreo(correo).get();
            List<MapaDetalleModel> detalles = data.getDetalles();
            if (usuario == null) {
                return null;
            }
            if (data.getMapa().getIdMapa() != null) {
                List<MapaDetalleEntity> listadoPasos = mapaDetalleRepository
                        .findByMapaIdMapa(data.getMapa().getIdMapa());

                // elimina los pasos incesesarios y deja los que no elimino
                for (MapaDetalleEntity item : listadoPasos) {
                    mapaDetalleRepository.deleteById(item.getIdDetalle());
                }
            }

            MapaEntity newMapa = new MapaEntity(data.getMapa().getIdMapa(),usuario,data.getMapa().getNombreMapa(),LocalDateTime.now());
            MapaEntity mapa = mapaRepository.save(newMapa);

            for (MapaDetalleModel item : detalles) {
                MapaDetalleEntity entity = new MapaDetalleEntity(
                        null,
                        item.getKey(),
                        item.getValue(),
                        item.getTipo(),
                        item.getValueMain(),
                        item.getEstatus(),
                        item.isStart(),
                        mapa);
                // item.setMapa(mapa);
                mapaDetalleRepository.save(entity);
            }

            return mapa;

        } catch (Exception e) {
            return null;
        }
    }

    @DeleteMapping("/{id}")
    public void deleteMapa(@PathVariable Long id) {
        mapaRepository.deleteById(id);
    }

}
