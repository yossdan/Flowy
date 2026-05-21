package Model.config; // Asegúrate de que apunte a tu ruta de paquetes real

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Aplica para TODOS los endpoints
                        .allowedOrigins("http://localhost:3000") // Tu frontend de Next.js
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos permitidos
                        .allowedHeaders("*") // Permitir cualquier cabecera (Content-Type, etc.)
                        .allowCredentials(true); // Por si manejas cookies o sesiones
            }
        };
    }
}
