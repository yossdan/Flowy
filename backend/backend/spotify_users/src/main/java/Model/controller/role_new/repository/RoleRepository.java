package Model.controller.role_new.repository;


import Model.controller.role_new.entities.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<RoleEntity, UUID> {
    Optional<RoleEntity> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    List<RoleEntity> findAllByNameStartingWithIgnoreCase(String keyword);
}
