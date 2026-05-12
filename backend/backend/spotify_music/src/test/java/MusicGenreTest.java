import App.App;

import Model.controller.music_genre_new.dto.request.CreateGenreRequestDto;
import Model.controller.music_genre_new.dto.response.GenreResponseDto;
import Model.controller.music_genre_new.service.MusicGenreService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest(classes = App.class)
public class MusicGenreTest {

    @Autowired
    MusicGenreService musicGenreService;


    @Test
    void createGenres(){
        List<String> genres = List.of(
                "Urbano",
                "Reggae",
                "R&B Contemporáneo",
                "Dance",
                "Synth-pop",
                "Electrónica",
                "Alternativo",
                "Folclore",
                "Corrido Tumbado",
                "Plena",
                "Bomba",
                "Jíbaro"
        );
        List<CreateGenreRequestDto> dtos = genres.stream().map(CreateGenreRequestDto::new).toList();
        musicGenreService.createGenres(dtos);
    }

    @Test
    void getAllGenres(){
        List<GenreResponseDto> dtos = musicGenreService.getAllGenres();
        dtos.forEach(System.out::println);
    }


    @Test
    void createGenre(){
        String name = "Electronica";
        musicGenreService.createGenre(new CreateGenreRequestDto(name));
    }

    @Test
    void searchGenresByKeyword(){
        List<GenreResponseDto> dtos = musicGenreService.getAllGenresByName("Elect");
        dtos.forEach(System.out::println);
    }
}
