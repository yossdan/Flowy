package Model.controller.user.dto.response;

import java.util.UUID;

public record UserProfilePhotoResponseDto (
        UUID userId,
        String profilePhotoObjectKey
){
}
