package Model.controller.user.service;

import Model.controller.user.dto.request.LoginUserRequestDto;
import Model.controller.user.dto.request.RegisterUserRequestDto;
import Model.controller.user.dto.request.UpdateUserRequestDto;
import Model.controller.user.dto.response.LoginUserResponseDto;
import Model.controller.user.dto.response.RegisterUserResponseDto;
import Model.controller.user.dto.response.UserProfilePhotoResponseDto;
import Model.controller.user.service.componets.UserRegistrationComponent;
import Model.controller.user.service.componets.UserSearchComponent;
import Model.controller.user.service.componets.UserUpdateComponent;
import org.springframework.stereotype.Service;
import Model.controller.user.dto.response.UpdateUserResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    private final UserRegistrationComponent registrationComponent;
    private final UserSearchComponent searchComponent;
    private final UserUpdateComponent updateComponent;

    public UserService(UserRegistrationComponent registrationComponent, UserSearchComponent searchComponent,
            UserUpdateComponent updateComponent) {
        this.registrationComponent = registrationComponent;
        this.searchComponent = searchComponent;
        this.updateComponent = updateComponent;
    }

    public RegisterUserResponseDto registerUser(RegisterUserRequestDto dto) {
        return registrationComponent.registerUser(dto);
    }

    public LoginUserResponseDto loginUser(LoginUserRequestDto dto) {
        return registrationComponent.loginUser(dto);
    }

    public List<UserProfilePhotoResponseDto> findUserProfilePhotoKey(List<UUID> userIds) {
        return searchComponent.findUserProfilePhotoKey(userIds);
    }

    public void updateUser(UpdateUserRequestDto dto) {
        updateComponent.updateUser(dto);
    }

    public UpdateUserResponseDto updateProfile(UUID userId, String userName, MultipartFile profilePhoto) {
        return updateComponent.updateProfile(userId, userName, profilePhoto);
    }
}
