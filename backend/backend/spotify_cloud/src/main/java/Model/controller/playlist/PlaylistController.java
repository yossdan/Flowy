package Model.controller.playlist;


import Model.controller.playlist.service.PlaylistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/playlist")
public class PlaylistController {
    private PlaylistService playlistService;
    @Autowired
    public PlaylistController(PlaylistService playlistService) {
        this.playlistService = playlistService;
    }

    @DeleteMapping("delete/playlistPhotos")
    public ResponseEntity<Void> deletePlaylistPhotos(@RequestParam List<String> coverImageObjectKeys) {
        playlistService.deletePlaylistPhotos(coverImageObjectKeys);
        return ResponseEntity.noContent().build();
    }
}
