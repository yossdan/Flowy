package Model.controller.album_detail_new;

import Model.controller.album_detail_new.dto.response.SongsResponseDto;
import Model.controller.album_detail_new.service.AlbumDetailService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/album-detail")
public class AlbumDetailController {

    private final AlbumDetailService service;

    public AlbumDetailController(AlbumDetailService service) {
        this.service = service;
    }

    @GetMapping("/songs/{albumId}")
    public ResponseEntity<List<SongsResponseDto>> findAllSongsByAlbum(@PathVariable UUID albumId) {
        List<SongsResponseDto> songs = service.findAllSongsByAlbum(albumId);

        return ResponseEntity.ok(songs);
    }
    @GetMapping("/song/file/{songId}")
    public ResponseEntity<byte[]> getSongById(@PathVariable UUID songId) {
        byte[] songFile = service.getSongById(songId);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .body(songFile);
    }
}