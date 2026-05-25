package Model.controller.user;

import Model.controller.user.dto.request.LoginUserRequestDto;
import Model.controller.user.dto.request.RegisterUserRequestDto;
import Model.controller.user.dto.request.UpdateUserRequestDto;
import Model.controller.user.dto.response.LoginUserResponseDto;
import Model.controller.user.dto.response.RegisterUserResponseDto;
import Model.controller.user.dto.response.UserProfilePhotoResponseDto;
import Model.controller.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/findProfilePhotoKeys")
    public ResponseEntity<List<UserProfilePhotoResponseDto>> findProfilePhotoKeysByUuids(
            @RequestParam List<UUID> userIds) {
        List<UserProfilePhotoResponseDto> userProfilePhotoResponseDtos = new ArrayList<>();
        if (!userIds.isEmpty()) {
            userProfilePhotoResponseDtos = userService.findUserProfilePhotoKey(userIds);
        }
        return ResponseEntity.ok(userProfilePhotoResponseDtos);
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterUserResponseDto> registerUser(
            @Valid @RequestBody RegisterUserRequestDto dto) {
        RegisterUserResponseDto response = userService.registerUser(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginUserResponseDto> loginUser(
            @Valid @RequestBody LoginUserRequestDto dto) {
        LoginUserResponseDto response = userService.loginUser(dto);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/update")
    public ResponseEntity<Void> updateUser(
            @Valid @RequestBody UpdateUserRequestDto dto) {

        userService.updateUser(dto);

        return ResponseEntity.noContent().build();
    }

}
