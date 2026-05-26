package Model.controller.artist_new;

import Model.controller.artist_new.dto.request.RegisterArtistRequestDto;
import Model.controller.artist_new.service.ArtistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

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
}