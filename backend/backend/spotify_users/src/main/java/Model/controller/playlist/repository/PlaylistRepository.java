package Model.controller.playlist.repository;

import Model.controller.playlist.entities.PlaylistEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PlaylistRepository extends JpaRepository<PlaylistEntity, UUID> {
    List<PlaylistEntity> findByUserId_Id(UUID userIdId);
}
