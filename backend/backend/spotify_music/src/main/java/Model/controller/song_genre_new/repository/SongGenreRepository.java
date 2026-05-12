package Model.controller.song_genre_new.repository;


import Model.controller.song_genre_new.entities.SongGenreEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SongGenreRepository extends JpaRepository<SongGenreEntity, UUID> {
}
