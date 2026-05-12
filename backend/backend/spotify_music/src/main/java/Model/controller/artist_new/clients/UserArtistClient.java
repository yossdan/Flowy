package Model.controller.artist_new.clients;



import Model.controller.artist_new.dto.response.UserProfilePhotoResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.UUID;

@Service
public class UserArtistClient {

    private final RestClient client;
    @Autowired
    public UserArtistClient(@Qualifier("userRestClient") RestClient client) {
        this.client = client;
    }

    public List<UserProfilePhotoResponseDto> findProfilePhotoKeysByUuids(List<UUID> userIds){
        return client.get()
                .uri(uriBuilder -> {
                    uriBuilder.path("/user/findProfilePhotoKeys");

                    if (userIds != null && !userIds.isEmpty()) {
                        userIds.forEach(id -> uriBuilder.queryParam("userIds", id));
                    }

                    return uriBuilder.build();
                })
                .retrieve()
                .body(new ParameterizedTypeReference<List<UserProfilePhotoResponseDto>>() {});
    }
}
