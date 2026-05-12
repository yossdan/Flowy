package Model.controller.users.dto.request;

import java.util.UUID;

public record UserProfilePhotoRequestDto(
        UUID userId,
        String profilePhotoObjectKey
) {
    @Override
    public String toString() {
        return "UserProfilePhotoRequestDto{" +
                "userId=" + userId +
                ", profilePhotoObjectKey='" + profilePhotoObjectKey + '\'' +
                '}';
    }
}
