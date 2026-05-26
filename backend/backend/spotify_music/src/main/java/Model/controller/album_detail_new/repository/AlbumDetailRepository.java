package Model.controller.album_detail_new.repository;

import Model.controller.album_detail_new.entities.AlbumDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AlbumDetailRepository extends JpaRepository<AlbumDetailEntity, UUID> {
    List<AlbumDetailEntity> findByTitleStartingWithIgnoreCase(String keyword);
}
