package Model.controller.album_new.dto.response;

import Model.controller.search.enums.SearchType;

import java.util.Arrays;
import java.util.UUID;

public record AlbumSearchResponseDto(
        UUID id,
        String title,
        String nameArtist,
        byte[] coverImage,
        SearchType type

) {
    @Override
    public String toString() {
        return "AlbumSearchResponseDto{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", nameArtist='" + nameArtist + '\'' +
                ", coverImage=" + Arrays.toString(coverImage) +
                ", type=" + type +
                '}';
    }
}
