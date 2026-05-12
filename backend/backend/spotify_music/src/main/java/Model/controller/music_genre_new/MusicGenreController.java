package Model.controller.music_genre_new;


import Model.controller.music_genre_new.dto.request.CreateGenreRequestDto;
import Model.controller.music_genre_new.dto.response.GenreResponseDto;
import Model.controller.music_genre_new.service.MusicGenreService;

import java.util.List;

public class MusicGenreController {
    public final MusicGenreService musicGenreService;
    public MusicGenreController(MusicGenreService musicGenreService) {
        this.musicGenreService = musicGenreService;
    }
    public void createGenre(CreateGenreRequestDto dto){
        musicGenreService.createGenre(dto);
    }
    public void createGenres(List<CreateGenreRequestDto> dtos){
        musicGenreService.createGenres(dtos);
    }
    public List<GenreResponseDto> getAllGenresByName(String keyword){return musicGenreService.getAllGenresByName(keyword);}
    public List<GenreResponseDto> getAllGenres(){return musicGenreService.getAllGenres();}

}
