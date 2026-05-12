package Model.controller.album;

import Model.controller.album.service.AlbumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/album/files")

public class AlbumController {
    private AlbumService albumService;
    @Autowired
    public AlbumController(AlbumService albumService) {
        this.albumService = albumService;
    }

    @PostMapping("/upload/coverPhoto")
    public ResponseEntity<?> uploadCoverImage  (@RequestParam String titleAlbum,
                                                @RequestPart MultipartFile file) {
        try {
            String coverImageObjectKey = albumService.uploadCoverPhoto(titleAlbum, file);

            return ResponseEntity.ok(coverImageObjectKey);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", "Error al subir el archivo",
                    "details", e.getMessage()
            ));
        }
    }

    @GetMapping("/download/coverPhoto/{coverImageObjectKey}")
    public ResponseEntity<byte[]> getCoverImage(@PathVariable String coverImageObjectKey) {
        try {
            byte[] file = albumService.getCoverPhoto(coverImageObjectKey);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + coverImageObjectKey + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(file);

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/download/coverPhotos")
    public ResponseEntity<Map<String, byte[]>> getCoverImages(
            @RequestParam List<String> coverImageObjectKeys) {

        try {
            Map<String, byte[]> files = albumService.getCoverPhotos(coverImageObjectKeys);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(files);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
