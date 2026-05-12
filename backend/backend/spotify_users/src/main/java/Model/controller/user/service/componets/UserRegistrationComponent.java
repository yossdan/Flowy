package Model.controller.user.service.componets;


import Model.controller.role_new.entities.RoleEntity;
import Model.controller.role_new.repository.RoleQueryRepository;
import Model.controller.user.dto.request.LoginUserRequestDto;
import Model.controller.user.dto.request.RegisterUserRequestDto;
import Model.controller.user.dto.response.LoginUserResponseDto;
import Model.controller.user.dto.response.RegisterUserResponseDto;
import Model.controller.user.entities.UserEntity;
import Model.controller.user.repository.UserQueryRepository;
import Model.controller.user.utils.UserContentCloudService;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserRegistrationComponent {

    private final UserQueryRepository repository;
    private final RoleQueryRepository roleRepository;

    private final UserContentCloudService userCloudService;
    private final String DEFAULT_PROFILE_PHOTO_KEY = "default_profile_picture.jpeg";

    @Autowired
    public UserRegistrationComponent(UserQueryRepository repository, RoleQueryRepository roleRepository, UserContentCloudService userCloudService) {
        this.repository = repository;
        this.roleRepository = roleRepository;
        this.userCloudService = userCloudService;
    }
    @Transactional
    public RegisterUserResponseDto registerUser(RegisterUserRequestDto dto){
        RoleEntity roleEntity = roleRepository.getRoleByName("Usuario");
        UserEntity userEntity = repository.registerUser(dto, DEFAULT_PROFILE_PHOTO_KEY, roleEntity);
        byte [] profilePhoto = userCloudService.getProfilePhoto(DEFAULT_PROFILE_PHOTO_KEY, DEFAULT_PROFILE_PHOTO_KEY);
        return new RegisterUserResponseDto(userEntity.getId(),userEntity.getName(),roleEntity.getName(),profilePhoto);
    }
    @Transactional
    public LoginUserResponseDto loginUser(LoginUserRequestDto dto){
        UserEntity userEntity = repository.loginUser(dto.email(), dto.password());
        RoleEntity roleEntity = roleRepository.getRoleById(userEntity.getRoleId().getId());
        byte [] profilePhoto = userCloudService.getProfilePhoto(userEntity.getProfilePhotoObjectKey(), DEFAULT_PROFILE_PHOTO_KEY);
        return new LoginUserResponseDto(userEntity.getId(),userEntity.getName(),roleEntity.getName(),profilePhoto);
    }

}
