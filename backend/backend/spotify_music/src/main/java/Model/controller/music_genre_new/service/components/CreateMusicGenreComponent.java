package Model.controller.music_genre_new.service.components;


import Model.controller.music_genre_new.dto.request.CreateGenreRequestDto;
import Model.controller.music_genre_new.repository.MusicGenreQueryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CreateMusicGenreComponent {
    private final MusicGenreQueryRepository repository;
    @Autowired
    public CreateMusicGenreComponent(MusicGenreQueryRepository repository) {
        this.repository = repository;
    }

    public void createGenre(CreateGenreRequestDto dto){
        repository.createGenre(dto);
    }
    public void createGenres(List<CreateGenreRequestDto> dtos){
        repository.createGenres(dtos);
    }
}
