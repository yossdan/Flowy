package Model.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class UserMicroserviceClient {

    @Bean(name = "userRestClient")
    public RestClient userRestClient(@Value("${user.service-url}") String userServiceUrl) {
        return RestClient.builder()
                .baseUrl(userServiceUrl)
                .build();
    }
}