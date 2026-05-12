package Model.controller.artist_new.dto.response;

import java.util.UUID;

public record UserProfilePhotoResponseDto(
        UUID userId,
        String profilePhotoObjectKey
) {
    @Override
    public String toString() {
        return "UserProfilePhotoResponseDto{" +
                "userId=" + userId +
                ", profilePhotoObjectKey='" + profilePhotoObjectKey + '\'' +
                '}';
    }
}
