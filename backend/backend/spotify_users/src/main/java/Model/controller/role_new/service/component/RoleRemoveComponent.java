package Model.controller.role_new.service.component;

import Model.controller.role_new.repository.RoleRepository;
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
