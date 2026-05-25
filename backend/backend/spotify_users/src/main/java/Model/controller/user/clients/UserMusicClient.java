package Model.controller.user.clients;

import Model.controller.user.dto.request.UpdateUserRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class UserMusicClient {
    private final RestClient client;
    @Autowired
    public UserMusicClient (@Qualifier("musicRestClient") RestClient client) {
        this.client = client;
    }
    public void createArtist(UpdateUserRequestDto dto) {
        client.post()
                .uri("/artists/create")
                .body(dto)
                .retrieve()
                .toBodilessEntity();
    }
}
