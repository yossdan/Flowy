package Model.controller.user.dto.response;

import java.util.UUID;

public record UpdateUserResponseDto (
        UUID userId,
        String userName,
        String roleName,
        byte [] profilePhoto
){
}
