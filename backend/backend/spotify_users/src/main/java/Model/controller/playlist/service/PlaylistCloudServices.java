package Model.controller.playlist.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class PlaylistCloudServices {
    private RestClient client;
    public PlaylistCloudServices(@Qualifier("cloudRestClient") RestClient client) {
        this.client = client;
    }
    public void deletePlaylist(List<String> coverImageObjectKeys){
        client.delete()
                .uri("playlist/delete/playlistPhotos",coverImageObjectKeys)
                .retrieve()
                .toBodilessEntity();
    }
}
