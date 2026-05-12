package Model.controller.song_genre_new.repository;


import Model.controller.album_detail_new.entities.AlbumDetailEntity;
import Model.controller.music_genre_new.entities.MusicGenreEntity;
import Model.controller.song_genre_new.entities.SongGenreEntity;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SongGenreQueryRepository {
    private final SongGenreRepository repository;

    public SongGenreQueryRepository(SongGenreRepository repository) {
        this.repository = repository;
    }
    public void saveSongGenres(AlbumDetailEntity songId, List<MusicGenreEntity> musicGenreEntities) {
        musicGenreEntities.forEach(musicGenre -> {
           repository.save(new SongGenreEntity(songId, musicGenre));
        });
    }
}
