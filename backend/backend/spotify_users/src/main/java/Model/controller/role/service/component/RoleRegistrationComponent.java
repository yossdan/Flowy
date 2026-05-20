package Model.controller.role.service.component;

import Model.controller.role.repository.RoleQueryRepository;
import org.springframework.stereotype.Component;

@Component
public class RoleRegistrationComponent {
    private final RoleQueryRepository repository;

    public RoleRegistrationComponent(RoleQueryRepository repository) {
        this.repository = repository;
    }

    public void registerRole(String roleName){
        repository.registerRole(roleName);
    }
}
