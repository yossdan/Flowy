package Model.controller.artist_new;

import Model.controller.artist_new.dto.request.RegisterArtistRequestDto;
import Model.controller.artist_new.dto.response.ArtistResponseDto;
import Model.controller.artist_new.service.ArtistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/artists")
public class ArtistController {

    private final ArtistService service;

    public ArtistController(ArtistService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createArtist(@RequestBody RegisterArtistRequestDto dto) {
        service.createArtist(dto);

        Map<String, String> response = new HashMap<>();
        response.put("role", "artist");

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/exists/{userId}")
    public ResponseEntity<Map<String, Object>> existsByUserId(@PathVariable UUID userId) {
        boolean exists = service.existsByUserId(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("isArtist", exists);
        response.put("role", exists ? "artist" : "listener");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/searchAll")
    public ResponseEntity<List<ArtistResponseDto>> findAllArtists() {
        List<ArtistResponseDto> artists = service.findAllArtists();

        return ResponseEntity.ok(artists);
    }

    @GetMapping("/searchByName")
    public ResponseEntity<List<ArtistResponseDto>> findAllArtistsByName(
            @RequestParam String keyword) {
        List<ArtistResponseDto> artists = service.findAllArtistsByName(keyword);

        return ResponseEntity.ok(artists);
    }

    @DeleteMapping("/delete-by-user/{userId}")
    public ResponseEntity<Void> deleteArtistByUserId(@PathVariable UUID userId) {
        service.deleteArtistByUserId(userId);
        return ResponseEntity.noContent().build();
    }
}