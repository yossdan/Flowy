package Model.controller.music;

import Model.controller.music.dto.request.SongRequestDto;
import Model.controller.music.service.MusicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/music")
public class MusicController {
    private MusicService musicService;
    @Autowired
    public MusicController(MusicService musicService) {
        this.musicService = musicService;
    }

    @PostMapping(value = "/upload/songs", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadSongs(
            @RequestParam UUID albumId,
            @RequestPart("songs") List<SongRequestDto> songs,
            @RequestPart("songFiles") List<MultipartFile> songFiles
    ) {

        if (songs.size() != songFiles.size()) {
            throw new IllegalArgumentException("Songs y files no coinciden");
        }

        Map<String, String> objectKeys = musicService.uploadSongs(albumId, songs, songFiles);

        return ResponseEntity.ok(objectKeys);
    }

    @GetMapping("/download/coverPhotos")
    public ResponseEntity<Map<String, byte[]>> getCoverImages(
            @RequestParam List<String> coverImageObjectKeys) {

        try {
            Map<String, byte[]> files = musicService.getCoverPhotos(coverImageObjectKeys);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(files);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/download/song")
    public ResponseEntity<byte[]> getSong(
            @RequestParam String songObjectKeys) {

        try {
            byte[] file = musicService.getSong(songObjectKeys);

            if (file == null || file.length == 0) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(file);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
