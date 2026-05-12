package Model.controller.song_artist_new.repository;


import Model.controller.album_detail_new.entities.AlbumDetailEntity;
import Model.controller.artist_new.entities.ArtistEntity;
import Model.controller.song_artist_new.entities.SongArtistEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SongArtistQueryRepository {
    private final SongArtistRepository repository;
    @Autowired
    public SongArtistQueryRepository(SongArtistRepository repository) {
        this.repository = repository;
    }
    public void saveSongCollaborator(AlbumDetailEntity songId, List<ArtistEntity> artistIds) {
        artistIds.forEach(artist -> {
            repository.save(new SongArtistEntity(songId, artist));
        });
    }
}
