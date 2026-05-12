package Model.controller.role_new.service.component;


import Model.controller.role_new.dto.response.RoleResponseDto;
import Model.controller.role_new.entities.RoleEntity;
import Model.controller.role_new.repository.RoleQueryRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class RoleSearchComponent {
    private final RoleQueryRepository repository;

    public RoleSearchComponent(RoleQueryRepository repository) {
        this.repository = repository;
    }
    public RoleEntity getRoleByName(String roleName) {
        return repository.getRoleByName(roleName);
    }
    public RoleEntity getRoleById(UUID roleId) {
        return repository.getRoleById(roleId);
    }
    public List<RoleResponseDto> getAllRoles(){
        List<RoleEntity> roles = repository.getAllRoles();
        return roles.stream()
                .map(roleEntity -> new RoleResponseDto(roleEntity.getId(), roleEntity.getName()))
                .collect(Collectors.toList());
    }
    public List<RoleResponseDto> getAllRolesByName(String keyword){
        List<RoleEntity> roles = repository.getAllRolesByName(keyword);
        return roles.stream()
                .map(roleEntity -> new RoleResponseDto(roleEntity.getId(), roleEntity.getName()))
                .collect(Collectors.toList());
    }


}
