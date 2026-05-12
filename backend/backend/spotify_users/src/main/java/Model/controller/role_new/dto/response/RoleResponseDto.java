package Model.controller.role_new.dto.response;

import java.util.UUID;

public record RoleResponseDto(
        UUID roleId,
        String roleName
) {
}
