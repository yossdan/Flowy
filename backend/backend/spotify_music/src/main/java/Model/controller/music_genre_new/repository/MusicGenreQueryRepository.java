package Model.controller.music_genre_new.repository;


import Model.controller.music_genre_new.dto.request.CreateGenreRequestDto;
import Model.controller.music_genre_new.entities.MusicGenreEntity;
import Model.controller.music_genre_new.exception.MusicGenreException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;


import java.util.Collection;
import java.util.List;

import java.util.UUID;

@Repository
public class MusicGenreQueryRepository {
    private final MusicGenreRepository repository;
    @Autowired
    public MusicGenreQueryRepository(MusicGenreRepository repository) {
        this.repository = repository;
    }
    public void createGenre(CreateGenreRequestDto dto){
        if(repository.existsByNameIgnoreCase(dto.name())){
            throw new MusicGenreException("Este género musical ya se encuentra registrado.");
        }

        repository.save(new MusicGenreEntity(dto.name()));
    }
    public void createGenres(List<CreateGenreRequestDto> dtos){
        dtos.forEach(dto -> {
            if(!repository.existsByNameIgnoreCase(dto.name())){
                repository.save(new MusicGenreEntity(dto.name()));
            }
        });
    }
    public List<MusicGenreEntity> getAllGenres(){
        return repository.findAll();
    }
    public List<MusicGenreEntity> getAllGenreByName(String keyword){
        return repository.findAllByNameIgnoreCase(keyword);
    }

    public List<MusicGenreEntity> findGenresById(Collection<UUID> genreIds){
        return repository.findAllById(genreIds);
    }
}
