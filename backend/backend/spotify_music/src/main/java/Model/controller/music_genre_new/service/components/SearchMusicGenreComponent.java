package Model.controller.music_genre_new.service.components;


import Model.controller.music_genre_new.dto.response.GenreResponseDto;
import Model.controller.music_genre_new.entities.MusicGenreEntity;
import Model.controller.music_genre_new.repository.MusicGenreQueryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class SearchMusicGenreComponent {
    private final MusicGenreQueryRepository repository;
    @Autowired
    public SearchMusicGenreComponent(MusicGenreQueryRepository repository) {
        this.repository = repository;
    }
    public List<GenreResponseDto> getAllGenres(){
        List<MusicGenreEntity> genres = repository.getAllGenres();
        if(!genres.isEmpty()){
            return genres.stream()
                    .map(genre -> new GenreResponseDto(genre.getId(), genre.getName()))
                    .toList();
        }
        return new ArrayList<>();
    }

    public List<GenreResponseDto> getAllGenreByName(String keyword){
        List<MusicGenreEntity> genres = repository.getAllGenreByName(keyword);
        if(!genres.isEmpty()){
            return genres.stream()
                    .map(genre -> new GenreResponseDto(genre.getId(), genre.getName()))
                    .toList();
        }
        return new ArrayList<>();
    }

}
