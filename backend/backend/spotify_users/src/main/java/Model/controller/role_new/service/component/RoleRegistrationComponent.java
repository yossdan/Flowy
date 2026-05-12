package Model.controller.role_new.service.component;

import Model.controller.role_new.repository.RoleQueryRepository;
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
