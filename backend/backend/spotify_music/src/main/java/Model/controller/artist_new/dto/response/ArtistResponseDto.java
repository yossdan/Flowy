package Model.controller.artist_new.dto.response;

import Model.controller.search.enums.SearchType;

import java.util.Arrays;
import java.util.UUID;

public record ArtistResponseDto(
        UUID artistId,
        String name,
        byte [] profilePhoto,
        SearchType type
) {
    @Override
    public String toString() {
        return "ArtistResponseDto{" +
                "artistId=" + artistId +
                ", name='" + name + '\'' +
                ", profilePhoto=" + Arrays.toString(profilePhoto) +
                ", type=" + type +
                '}';
    }
}
