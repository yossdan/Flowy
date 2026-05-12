package Model.controller.song_genre_new.service.components;


import Model.controller.album_detail_new.entities.AlbumDetailEntity;
import Model.controller.music_genre_new.entities.MusicGenreEntity;
import Model.controller.music_genre_new.repository.MusicGenreQueryRepository;

import Model.controller.song_genre_new.dto.request.GenreIdRequestDto;
import Model.controller.song_genre_new.repository.SongGenreQueryRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class CreateSongGenreComponent {

    private final SongGenreQueryRepository songGenreQueryRepository;
    private final MusicGenreQueryRepository  musicGenreQueryRepository;

    public CreateSongGenreComponent(SongGenreQueryRepository songGenreQueryRepository, MusicGenreQueryRepository musicGenreQueryRepository) {
        this.songGenreQueryRepository = songGenreQueryRepository;
        this.musicGenreQueryRepository = musicGenreQueryRepository;
    }

    public void saveSongGenres(AlbumDetailEntity songId, List<GenreIdRequestDto> genreDtos){
        List<UUID> genreIds = genreDtos.stream().map(GenreIdRequestDto::genreId).toList();
        List<MusicGenreEntity> genreEntities = musicGenreQueryRepository.findGenresById(genreIds);
        songGenreQueryRepository.saveSongGenres(songId, genreEntities);
    }
}
