package Model.controller.music_genre_new.service;


import Model.controller.music_genre_new.dto.request.CreateGenreRequestDto;
import Model.controller.music_genre_new.dto.response.GenreResponseDto;
import Model.controller.music_genre_new.service.components.CreateMusicGenreComponent;
import Model.controller.music_genre_new.service.components.SearchMusicGenreComponent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MusicGenreService {
    private final CreateMusicGenreComponent createMusicGenreComponent;
    private final SearchMusicGenreComponent searchMusicGenreComponent;

    @Autowired
    public MusicGenreService(CreateMusicGenreComponent  createMusicGenreComponent, SearchMusicGenreComponent searchMusicGenreComponent) {
        this.createMusicGenreComponent = createMusicGenreComponent;
        this.searchMusicGenreComponent = searchMusicGenreComponent;
    }
    public void createGenre(CreateGenreRequestDto dto){
        createMusicGenreComponent.createGenre(dto);
    }
    public void createGenres(List<CreateGenreRequestDto> dtos){
        createMusicGenreComponent.createGenres(dtos);
    }
    public List<GenreResponseDto> getAllGenresByName(String keyword){return searchMusicGenreComponent.getAllGenreByName(keyword);}
    public List<GenreResponseDto> getAllGenres(){return searchMusicGenreComponent.getAllGenres();}

}
