package Model.controller.artist_new.clients;



import Model.controller.artist_new.dto.request.UserProfilePhotoRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudArtistClient {

    private final RestClient client;
    @Autowired
    public CloudArtistClient(@Qualifier("cloudRestClient") RestClient client) {
        this.client = client;
    }

    public Map<UUID, byte[]> getArtistProfilePhoto(List<UserProfilePhotoRequestDto> userDtos) {
        return client.post()
                .uri("/artist/download/artistProfilePhoto")
                .body(userDtos)
                .retrieve()
                .body(new ParameterizedTypeReference<Map<UUID, byte[]>>() {});
    }
}
