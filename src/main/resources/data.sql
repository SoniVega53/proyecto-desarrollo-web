INSERT INTO usuarios (nombre, correo, password,rol) VALUES ('admin', 'admin@gmail.com', '$2a$10$JiHLWWlSTa/Djt8LHhli5eUwvMC8dShxu39HAcfPOYBkdLW1D5W5C','ADMIN');

INSERT INTO mapas (id_usuario, nombre_mapa) VALUES
(1, 'Mapa 1'),
(1, 'Mapa 2'),
(1, 'Mapa 3');

-- Mapa 1
INSERT INTO mapa_detalle (id_mapa, celda_key, celda_value, tipo, value_main, estatus, start) VALUES
(1, 1, 0, 'TOP_LEFT', 0, 0, TRUE),
(1, 2, 1, 'TOP', 0, 0, FALSE),
(1, 3, 2, 'TOP', 0, 0, FALSE),
(1, 9, 2, 'CENTER', 1, 0, FALSE),
(1, 15, 2, 'CENTER', 2, 0, FALSE),
(1, 14, 1, 'CENTER', 2, 0, FALSE),
(1, 13, 0, 'LEFT', 2, 0, FALSE),
(1, 19, 0, 'LEFT', 3, 0, FALSE),
(1, 25, 0, 'LEFT', 4, 0, FALSE),
(1, 26, 1, 'CENTER', 4, 0, FALSE),
(1, 27, 2, 'CENTER', 4, 0, FALSE),
(1, 33, 2, 'BOTTOM', 5, 0, FALSE),
(1, 34, 3, 'BOTTOM', 5, 0, FALSE),
(1, 35, 4, 'BOTTOM', 5, 0, FALSE),
(1, 29, 4, 'CENTER', 4, 0, FALSE),
(1, 23, 4, 'CENTER', 3, 0, FALSE),
(1, 17, 4, 'CENTER', 2, 0, FALSE),
(1, 11, 4, 'CENTER', 1, 0, FALSE),
(1, 5, 4, 'TOP', 0, 0, FALSE),
(1, 6, 5, 'TOP_RIGHT', 0, 0, FALSE);

-- Mapa 2
INSERT INTO mapa_detalle (id_mapa, celda_key, celda_value, tipo, value_main, estatus, start) VALUES
(2, 1, 0, 'TOP_LEFT', 0, 0, TRUE),
(2, 2, 1, 'TOP', 0, 0, FALSE),
(2, 3, 2, 'TOP', 0, 0, FALSE),
(2, 4, 3, 'TOP', 0, 0, FALSE),
(2, 5, 4, 'TOP', 0, 0, FALSE),
(2, 6, 5, 'TOP_RIGHT', 0, 0, FALSE),
(2, 12, 5, 'RIGHT', 1, 0, FALSE),
(2, 18, 5, 'RIGHT', 2, 0, FALSE),
(2, 24, 5, 'RIGHT', 3, 0, FALSE),
(2, 30, 5, 'RIGHT', 4, 0, FALSE),
(2, 36, 5, 'BOTTOM_RIGHT', 5, 0, FALSE),
(2, 35, 4, 'BOTTOM', 5, 0, FALSE),
(2, 34, 3, 'BOTTOM', 5, 0, FALSE),
(2, 28, 3, 'CENTER', 4, 0, FALSE),
(2, 22, 3, 'CENTER', 3, 0, FALSE),
(2, 16, 3, 'CENTER', 2, 0, FALSE),
(2, 15, 2, 'CENTER', 2, 0, FALSE),
(2, 14, 1, 'CENTER', 2, 0, FALSE),
(2, 20, 1, 'CENTER', 3, 0, FALSE),
(2, 26, 1, 'CENTER', 4, 0, FALSE),
(2, 32, 1, 'BOTTOM', 5, 0, FALSE),
(2, 31, 0, 'BOTTOM_LEFT', 5, 0, FALSE);

-- Mapa 3
INSERT INTO mapa_detalle (id_mapa, celda_key, celda_value, tipo, value_main, estatus, start) VALUES
(3, 1, 0, 'TOP_LEFT', 0, 0, TRUE),
(3, 2, 1, 'TOP', 0, 0, FALSE),
(3, 3, 2, 'TOP', 0, 0, FALSE),
(3, 4, 3, 'TOP', 0, 0, FALSE),
(3, 5, 4, 'TOP', 0, 0, FALSE),
(3, 11, 4, 'CENTER', 1, 0, FALSE),
(3, 17, 4, 'CENTER', 2, 0, FALSE),
(3, 23, 4, 'CENTER', 3, 0, FALSE),
(3, 22, 3, 'CENTER', 3, 0, FALSE),
(3, 21, 2, 'CENTER', 3, 0, FALSE),
(3, 15, 2, 'CENTER', 2, 0, FALSE),
(3, 14, 1, 'CENTER', 2, 0, FALSE),
(3, 13, 0, 'LEFT', 2, 0, FALSE),
(3, 19, 0, 'LEFT', 3, 0, FALSE),
(3, 25, 0, 'LEFT', 4, 0, FALSE),
(3, 31, 0, 'BOTTOM_LEFT', 5, 0, FALSE),
(3, 32, 1, 'BOTTOM', 5, 0, FALSE),
(3, 33, 2, 'BOTTOM', 5, 0, FALSE),
(3, 34, 3, 'BOTTOM', 5, 0, FALSE),
(3, 35, 4, 'BOTTOM', 5, 0, FALSE);
