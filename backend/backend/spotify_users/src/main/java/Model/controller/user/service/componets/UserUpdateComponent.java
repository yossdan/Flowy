package Model.controller.user.service.componets;

import Model.controller.role.entities.RoleEntity;
import Model.controller.role.repository.RoleQueryRepository;
import Model.controller.user.dto.request.UpdateUserRequestDto;
import Model.controller.user.dto.response.UpdateUserResponseDto;
import Model.controller.user.entities.UserEntity;
import Model.controller.user.repository.UserQueryRepository;
import Model.controller.user.utils.UserContentCloudService;
import Model.controller.user.utils.UserMusicContentCloudService;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Component
public class UserUpdateComponent {

    private final UserQueryRepository repository;
    private final RoleQueryRepository roleRepository;
    private final UserMusicContentCloudService userMusicContentCloudService;
    private final UserContentCloudService userContentCloudService;

    private final String DEFAULT_PROFILE_PHOTO_KEY = "default_profile_picture.jpeg";

    public UserUpdateComponent(
            UserQueryRepository repository,
            RoleQueryRepository roleRepository,
            UserMusicContentCloudService userMusicContentCloudService,
            UserContentCloudService userContentCloudService) {
        this.repository = repository;
        this.roleRepository = roleRepository;
        this.userMusicContentCloudService = userMusicContentCloudService;
        this.userContentCloudService = userContentCloudService;
    }

    public void updateUser(UpdateUserRequestDto dto) {
        RoleEntity roleEntity = roleRepository.getRoleByName("Artista");
        repository.updateUser(dto, roleEntity);
        userMusicContentCloudService.createArtist(dto);
    }

    public UpdateUserResponseDto updateProfile(
            UUID userId,
            String userName,
            MultipartFile profilePhoto) {
        UserEntity userEntity = repository.findUserById(userId);

        userEntity.setName(userName);

        if (profilePhoto != null && !profilePhoto.isEmpty()) {
            String profilePhotoKey = userContentCloudService.uploadProfilePhoto(userId, profilePhoto);

            userEntity.setProfilePhotoObjectKey(profilePhotoKey);
        }

        repository.save(userEntity);

        RoleEntity roleEntity = roleRepository.getRoleById(userEntity.getRoleId().getId());

        byte[] photo = userContentCloudService.getProfilePhoto(
                userEntity.getProfilePhotoObjectKey(),
                DEFAULT_PROFILE_PHOTO_KEY);

        return new UpdateUserResponseDto(
                userEntity.getId(),
                userEntity.getName(),
                roleEntity.getName(),
                photo);
    }
}