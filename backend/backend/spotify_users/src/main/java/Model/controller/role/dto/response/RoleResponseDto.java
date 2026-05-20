package Model.controller.role.dto.response;

import java.util.UUID;

public record RoleResponseDto(
        UUID roleId,
        String roleName
) {
}
