package Model.controller.user.service;

import Model.controller.user.dto.request.LoginUserRequestDto;
import Model.controller.user.dto.request.RegisterUserRequestDto;
import Model.controller.user.dto.response.LoginUserResponseDto;
import Model.controller.user.dto.response.RegisterUserResponseDto;
import Model.controller.user.dto.response.UserProfilePhotoResponseDto;
import Model.controller.user.service.componets.UserRegistrationComponent;
import Model.controller.user.service.componets.UserSearchComponent;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    private final UserRegistrationComponent registrationComponent;
    private final UserSearchComponent searchComponent;

    public UserService(UserRegistrationComponent registrationComponent, UserSearchComponent searchComponent) {
        this.registrationComponent = registrationComponent;
        this.searchComponent = searchComponent;
    }
    public RegisterUserResponseDto registerUser(RegisterUserRequestDto dto){
        return registrationComponent.registerUser(dto);
    }
    public LoginUserResponseDto loginUser(LoginUserRequestDto dto){
        return registrationComponent.loginUser(dto);
    }
    public List<UserProfilePhotoResponseDto> findUserProfilePhotoKey(List<UUID> userIds){
        return searchComponent.findUserProfilePhotoKey(userIds);
    }
}
