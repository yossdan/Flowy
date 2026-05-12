package Model.controller.user.service.componets;

import Model.controller.user.dto.response.UserProfilePhotoResponseDto;
import Model.controller.user.entities.UserEntity;
import Model.controller.user.repository.UserQueryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class UserSearchComponent {
    private final UserQueryRepository repository;
    @Autowired
    public UserSearchComponent(UserQueryRepository repository) {
        this.repository = repository;
    }
    public List<UserProfilePhotoResponseDto> findUserProfilePhotoKey(List<UUID> userIds){
        List<UserEntity> userEntities = repository.findUsersByIds(userIds);
        return userEntities.stream().map(userEntity -> new UserProfilePhotoResponseDto(userEntity.getId(), userEntity.getProfilePhotoObjectKey())).toList();
    }
}
