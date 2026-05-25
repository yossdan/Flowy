package Model.controller.role.service.component;

import Model.controller.role.repository.RoleRepository;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class RoleRemoveComponent {

    private final RoleRepository repository;

    public RoleRemoveComponent(RoleRepository repository) {
        this.repository = repository;
    }

    public void deleteRole(UUID roleId){
        repository.deleteById(roleId);
    }
}
