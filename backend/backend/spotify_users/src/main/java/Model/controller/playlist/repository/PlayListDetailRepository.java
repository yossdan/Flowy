package Model.controller.playlist.repository;

import Model.controller.playlist.entities.PlayListDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PlayListDetailRepository extends JpaRepository<PlayListDetailEntity, UUID> {
}
