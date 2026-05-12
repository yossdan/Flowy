package Model.controller.artist_new.repository;


import Model.controller.artist_new.entities.ArtistEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ArtistRepository extends JpaRepository<ArtistEntity, UUID> {
    boolean existsByName(String name);

    List<ArtistEntity> findAllByNameContainingIgnoreCase(String name);

    Optional<ArtistEntity> findByUserId(UUID userId);

    List<ArtistEntity> findAllByNameStartingWithIgnoreCase(String keyword);
}