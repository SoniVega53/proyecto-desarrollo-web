package com.soni.proyecto_spring.proyecto_spring.controller;

import java.util.ArrayList;
import java.util.List;
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
import com.soni.proyecto_spring.proyecto_spring.repository.MapaDetalleRepository;
import com.soni.proyecto_spring.proyecto_spring.repository.MapaRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/mapas")
@RequiredArgsConstructor
public class MapaController {

    private final MapaRepository mapaRepository;
    private final MapaDetalleRepository mapaDetalleRepository;

    @GetMapping
    public List<MapaEntity> getAllMapas() {
        return mapaRepository.findAll();
    }

    @GetMapping("/aletorioMapa")
    public List<MapaDetalleModel> getMapaAletorioMapa() {
        List<MapaEntity> mapas = mapaRepository.findAll();

        int indiceAleatorio = new Random().nextInt(mapas.size());
        MapaEntity mapaSeleccionado = mapas.get(indiceAleatorio);


        List<MapaDetalleEntity> listadoPasos = mapaDetalleRepository.findByMapaIdMapa(mapaSeleccionado.getIdMapa());
        List<MapaDetalleModel> seListadoPa = new ArrayList<>();
        for (MapaDetalleEntity entity : listadoPasos) {
            seListadoPa.add(new MapaDetalleModel(mapaSeleccionado.getIdMapa(),entity.getCeldaKey(), entity.getCeldaValue(),
                    entity.getTipo(), entity.getValueMain(), entity.getEstatus(), entity.isStart()));
        }
        

        return seListadoPa;
    }

    @GetMapping("/{id}/detalles")
    public List<MapaDetalleModel> getDetallesPorMapa(@PathVariable Long id) {
        List<MapaDetalleEntity> listadoPasos = mapaDetalleRepository.findByMapaIdMapa(id);
        List<MapaDetalleModel> seListadoPa = new ArrayList<>();
        for (MapaDetalleEntity entity : listadoPasos) {
            seListadoPa.add(new MapaDetalleModel(id,entity.getCeldaKey(), entity.getCeldaValue(),
                    entity.getTipo(), entity.getValueMain(), entity.getEstatus(), entity.isStart()));
        }

        return seListadoPa;
    }

    @PostMapping
    public MapaEntity createMapa(@RequestBody MapaActualizarModel data) {
        try {
            List<MapaDetalleModel> detalles = data.getDetalles();

            if (data.getMapa().getIdMapa() != null) {
                List<MapaDetalleEntity> listadoPasos = mapaDetalleRepository.findByMapaIdMapa(data.getMapa().getIdMapa());

                // elimina los pasos incesesarios y deja los que no elimino
                for (MapaDetalleEntity item : listadoPasos) {
                   mapaDetalleRepository.deleteById(item.getIdDetalle());
                }
            }
            MapaEntity mapa = mapaRepository.save(data.getMapa());

            for (MapaDetalleModel item : detalles) {
                MapaDetalleEntity entity = new MapaDetalleEntity(
                    null,
                    item.getKey(),
                    item.getValue(),
                    item.getTipo(),
                    item.getValueMain(),
                    item.getEstatus(),
                    item.isStart(),
                    mapa
                );
                //item.setMapa(mapa);
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
