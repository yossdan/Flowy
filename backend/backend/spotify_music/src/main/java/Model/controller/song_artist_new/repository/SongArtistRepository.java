package Model.controller.song_artist_new.repository;


import Model.controller.song_artist_new.entities.SongArtistEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SongArtistRepository extends JpaRepository<SongArtistEntity, UUID> {
}
