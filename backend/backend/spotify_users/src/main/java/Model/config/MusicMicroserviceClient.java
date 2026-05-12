package Model.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class MusicMicroserviceClient {

    //music.service-url
    @Bean(name = "musicRestClient")
    public RestClient musicRestClient(@Value("${music.service-url}") String musicServiceUrl) {
        return RestClient.builder()
                .baseUrl(musicServiceUrl)
                .build();
    }
}