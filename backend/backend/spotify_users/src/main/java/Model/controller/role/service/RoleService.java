package Model.controller.role.service;


import Model.controller.role.dto.response.RoleResponseDto;
import Model.controller.role.service.component.RoleRegistrationComponent;
import Model.controller.role.service.component.RoleRemoveComponent;
import Model.controller.role.service.component.RoleSearchComponent;
import Model.controller.role.service.component.RoleUpdateComponent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class RoleService {
    private final RoleRegistrationComponent registrationComponent;
    private final RoleSearchComponent searchComponent;
    private final RoleRemoveComponent removeComponent;
    private final RoleUpdateComponent updateComponent;

    @Autowired
    public RoleService(RoleRegistrationComponent registrationComponent, RoleSearchComponent searchComponent, RoleRemoveComponent removeComponent, RoleUpdateComponent updateComponent) {
        this.registrationComponent = registrationComponent;
        this.searchComponent = searchComponent;
        this.removeComponent = removeComponent;
        this.updateComponent = updateComponent;
    }

    public void registerRole(String roleName){
        registrationComponent.registerRole(roleName);
    }
    public List<RoleResponseDto> getAllRoles(){
        return searchComponent.getAllRoles();
    }
    public List<RoleResponseDto> getAllRolesByName(String keyword){
        return searchComponent.getAllRolesByName(keyword);
    }
    public void deleteRole(UUID roleId){
        removeComponent.deleteRole(roleId);
    }
}
