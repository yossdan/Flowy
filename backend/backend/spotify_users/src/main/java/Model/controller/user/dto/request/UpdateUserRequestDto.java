package Model.controller.user.dto.request;

import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public record UpdateUserRequestDto(
        UUID userId,
        String userName,
        String email,
        String password,
        MultipartFile file
) {


    public UpdateUserRequestDto(UUID userId, String userName, String email, String password) {
        this(userId, userName, email, password, null);
    }

}