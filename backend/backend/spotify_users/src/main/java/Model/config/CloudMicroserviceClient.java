package Model.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class CloudMicroserviceClient {

    @Bean(name = "cloudRestClient")
    public RestClient cloudRestClient(@Value("${cloud.service-url}") String cloudServiceUrl) {
        return RestClient.builder()
                .baseUrl(cloudServiceUrl)
                .build();
    }
}