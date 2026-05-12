package Model.controller.music_genre_new.repository;


import Model.controller.music_genre_new.entities.MusicGenreEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MusicGenreRepository extends JpaRepository<MusicGenreEntity, UUID> {
    Optional<MusicGenreEntity> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    List<MusicGenreEntity> findAllByNameIgnoreCase(String name);
}
