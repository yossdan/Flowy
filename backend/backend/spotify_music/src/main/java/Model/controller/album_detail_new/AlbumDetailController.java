package Model.controller.album_detail_new;

import Model.controller.album_detail_new.dto.response.SongsResponseDto;
import Model.controller.album_detail_new.service.AlbumDetailService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*", exposedHeaders = {
        "Content-Range",
        "Accept-Ranges",
        "Content-Length",
        "Content-Type"
})
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
    public ResponseEntity<byte[]> getSongById(
            @PathVariable UUID songId,
            @RequestHeader(value = "Range", required = false) String range) {
        byte[] songFile = service.getSongById(songId);
        int fileLength = songFile.length;

        if (range == null || !range.startsWith("bytes=")) {
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType("audio/mpeg"))
                    .contentLength(fileLength)
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                    .body(songFile);
        }

        String rangeValue = range.replace("bytes=", "").trim();

        if (rangeValue.contains(",")) {
            rangeValue = rangeValue.split(",")[0].trim();
        }

        int start;
        int end;

        try {
            if (rangeValue.startsWith("-")) {
                int suffixLength = Integer.parseInt(rangeValue.substring(1));
                start = Math.max(fileLength - suffixLength, 0);
                end = fileLength - 1;
            } else {
                String[] parts = rangeValue.split("-", 2);
                start = Integer.parseInt(parts[0]);
                end = parts.length > 1 && !parts[1].isEmpty()
                        ? Integer.parseInt(parts[1])
                        : fileLength - 1;
            }

            end = Math.min(end, fileLength - 1);

            if (start < 0 || start >= fileLength || end < start) {
                return ResponseEntity.status(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
                        .header(HttpHeaders.CONTENT_RANGE, "bytes */" + fileLength)
                        .build();
            }

            byte[] partialContent = Arrays.copyOfRange(songFile, start, end + 1);

            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                    .contentType(MediaType.parseMediaType("audio/mpeg"))
                    .contentLength(partialContent.length)
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    .header(HttpHeaders.CONTENT_RANGE, "bytes " + start + "-" + end + "/" + fileLength)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                    .body(partialContent);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
                    .header(HttpHeaders.CONTENT_RANGE, "bytes */" + fileLength)
                    .build();
        }
    }
}