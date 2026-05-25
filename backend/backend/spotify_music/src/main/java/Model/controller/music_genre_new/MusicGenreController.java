package Model.controller.music_genre_new;


import Model.controller.music_genre_new.dto.request.CreateGenreRequestDto;
import Model.controller.music_genre_new.dto.response.GenreResponseDto;
import Model.controller.music_genre_new.service.MusicGenreService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/genres")
public class MusicGenreController {

    private final MusicGenreService musicGenreService;

    public MusicGenreController(MusicGenreService musicGenreService) {
        this.musicGenreService = musicGenreService;
    }

    @PostMapping("/create")
    public ResponseEntity<Void> createGenre(
            @RequestBody CreateGenreRequestDto dto
    ) {
        musicGenreService.createGenre(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<GenreResponseDto>> getAllGenresByName(
            @RequestParam String keyword
    ) {
        List<GenreResponseDto> genres = musicGenreService.getAllGenresByName(keyword);
        return ResponseEntity.ok(genres);
    }

    @GetMapping("/searchAll")
    public ResponseEntity<List<GenreResponseDto>> getAllGenres() {
        List<GenreResponseDto> genres = musicGenreService.getAllGenres();
        return ResponseEntity.ok(genres);
    }
}
