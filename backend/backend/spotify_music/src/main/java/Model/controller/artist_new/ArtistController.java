package Model.controller.artist_new;

import Model.controller.artist_new.dto.request.RegisterArtistRequestDto;
import Model.controller.artist_new.dto.request.UpdateArtistNameRequestDto;
import Model.controller.artist_new.dto.response.ArtistDetailResponseDto;
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

    @GetMapping("/details/{artistId}")
    public ResponseEntity<ArtistDetailResponseDto> getArtistDetails(@PathVariable UUID artistId) {
        ArtistDetailResponseDto artistDetails = service.getArtistDetails(artistId);

        return ResponseEntity.ok(artistDetails);
    }

    @PutMapping("/update-name-by-user")
    public ResponseEntity<Map<String, String>> updateArtistNameByUserId(
            @RequestBody UpdateArtistNameRequestDto dto) {

        service.updateArtistNameByUserId(dto.userId(), dto.artistName());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Nombre del artista actualizado correctamente");

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete-by-user/{userId}")
    public ResponseEntity<Map<String, String>> deleteArtistByUserId(@PathVariable UUID userId) {
        service.deleteArtistByUserId(userId);

        Map<String, String> response = new HashMap<>();
        response.put("role", "listener");
        response.put("message", "El usuario dejó de ser artista correctamente");

        return ResponseEntity.ok(response);
    }
}