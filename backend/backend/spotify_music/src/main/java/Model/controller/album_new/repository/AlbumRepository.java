package Model.controller.album_new.repository;

import Model.controller.album_new.entities.AlbumEntity;
import Model.controller.artist_new.entities.ArtistEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AlbumRepository extends JpaRepository<AlbumEntity, UUID> {
    List<AlbumEntity> findByTitleStartingWithIgnoreCase(String keyword);

    List<AlbumEntity> findAllByArtistId(ArtistEntity artistId);
}
