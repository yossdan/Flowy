package Model.controller.user.dto.request;

import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public record UpdateUserRequestDto(
        UUID userId,
        String userName
) {




}