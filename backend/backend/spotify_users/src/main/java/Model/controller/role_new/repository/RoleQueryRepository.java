package Model.controller.role_new.repository;


import Model.controller.role_new.entities.RoleEntity;
import Model.controller.role_new.exception.RoleException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import javax.management.relation.Role;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class RoleQueryRepository {

    private final RoleRepository repository;

    public RoleQueryRepository(RoleRepository repository) {
        this.repository = repository;
    }
    @Transactional
    public void registerRole(String roleName){
        if(!repository.existsByNameIgnoreCase(roleName)){
            repository.save(new RoleEntity(roleName));
        }else{
            throw new RoleException("No es posible generar el rol solicitado, ya que se encuentra previamente registrado en el sistema.");
        }
    }
    public RoleEntity getRoleByName(String roleName) {
        Optional<RoleEntity> optionalRoleEntity = repository.findByNameIgnoreCase(roleName);
        if(optionalRoleEntity.isPresent()){
            return optionalRoleEntity.get();
        }
        throw new RoleException("No encontramos coincidencias con el género solicitado. Por favor, verifica la información e inténtalo nuevamente.");
    }
    public RoleEntity getRoleById(UUID roleId) {
        Optional <RoleEntity> roleEntity= repository.findById(roleId);
        if(roleEntity.isPresent()){
            return roleEntity.get();
        }
        throw new RoleException("El ID proporcionado no corresponde a ningún rol registrado. Por favor, verifica la información e inténtalo nuevamente.");
    }
    public List<RoleEntity> getAllRoles(){
        return repository.findAll();
    }
    public List<RoleEntity> getAllRolesByName(String keyword){
        return repository.findAllByNameStartingWithIgnoreCase(keyword);
    }
    @Transactional
    public void deleteRole(UUID roleId){
        if (repository.existsById(roleId)) {
            repository.deleteById(roleId);
        }
        throw new RoleException("No fue posible eliminar el rol solicitado porque no se encuentra en nuestra base de datos. Por favor, verifica la información e inténtalo nuevamente.");
    }
}
