package com.soni.proyecto_spring.proyecto_spring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/")
    public String homeMapa() {
        return "homeMapa";
    }
    @GetMapping("/admin")
    public String administrador() {
        return "administrador";
    }

    @GetMapping("/crear-mapa")
    public String mostrarCrearMapa() {
        return "crearMapa";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }
    @GetMapping("/perfil")
    public String perfil() {
        return "perfil";
    }
}
