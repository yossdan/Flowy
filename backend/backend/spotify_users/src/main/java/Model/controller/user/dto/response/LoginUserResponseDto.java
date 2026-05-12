package Model.controller.user.dto.response;

import java.util.Arrays;
import java.util.UUID;

public record LoginUserResponseDto(
        UUID userId,
        String userName,
        String roleName,
        byte [] profilePhoto

) {
    @Override
    public String toString() {
        return "RegisterUserResponseDto{" +
                "userId=" + userId +
                ", userName='" + userName + '\'' +
                ", roleName='" + roleName + '\'' +
                ", profilePhoto=" + Arrays.toString(profilePhoto) +
                '}';
    }
}