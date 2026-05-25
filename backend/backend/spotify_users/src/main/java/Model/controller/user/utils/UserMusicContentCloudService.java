package Model.controller.user.utils;

import Model.controller.user.clients.UserMusicClient;
import Model.controller.user.dto.request.UpdateUserRequestDto;
import org.springframework.stereotype.Component;

@Component
public class UserMusicContentCloudService {

    private final UserMusicClient client;

    public UserMusicContentCloudService(UserMusicClient client) {
        this.client = client;
    }

    public void createArtist(UpdateUserRequestDto dto){
        client.createArtist(dto);
    }
}
