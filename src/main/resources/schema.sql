-- schema.sql
-- CREATE DATABASE IF NOT EXISTS gameProyectodb;
-- USE gameProyectodb;

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(150) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mapas (
    id_mapa INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombre_mapa VARCHAR(100) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) 
        ON DELETE CASCADE 
);

CREATE TABLE IF NOT EXISTS mapa_detalle (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_mapa INT NOT NULL,
    celda_key INT NOT NULL,
    celda_value INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    value_main INT NOT NULL,
    estatus INT DEFAULT 0,
    start BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_mapa) REFERENCES mapas(id_mapa)
        ON DELETE CASCADE
);