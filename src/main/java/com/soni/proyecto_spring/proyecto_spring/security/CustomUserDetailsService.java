package com.soni.proyecto_spring.proyecto_spring.security;

import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.soni.proyecto_spring.proyecto_spring.model.UsuarioEntity;
import com.soni.proyecto_spring.proyecto_spring.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService  implements UserDetailsService{
    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        UsuarioEntity usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        return User.builder()
                .username(usuario.getCorreo())
                .password(usuario.getPassword())
                .roles("USER")
                .build();
    }
}
