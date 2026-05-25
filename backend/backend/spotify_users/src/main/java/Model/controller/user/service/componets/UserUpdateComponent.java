package Model.controller.user.service.componets;

import Model.controller.role.entities.RoleEntity;
import Model.controller.role.repository.RoleQueryRepository;
import Model.controller.user.dto.request.UpdateUserRequestDto;
import Model.controller.user.repository.UserQueryRepository;
import Model.controller.user.utils.UserMusicContentCloudService;
import org.springframework.stereotype.Component;

@Component
public class UserUpdateComponent {
    private final UserQueryRepository repository;
    private final RoleQueryRepository roleRepository;
    private final UserMusicContentCloudService userMusicContentCloudService;

    public UserUpdateComponent(UserQueryRepository repository, RoleQueryRepository roleRepository, UserMusicContentCloudService userMusicContentCloudService) {
        this.repository = repository;
        this.roleRepository = roleRepository;
        this.userMusicContentCloudService = userMusicContentCloudService;
    }

    public void updateUser(UpdateUserRequestDto dto){
        RoleEntity roleEntity = roleRepository.getRoleByName("Artista");
        repository.updateUser(dto, roleEntity);
        userMusicContentCloudService.createArtist(dto);
    }
}
