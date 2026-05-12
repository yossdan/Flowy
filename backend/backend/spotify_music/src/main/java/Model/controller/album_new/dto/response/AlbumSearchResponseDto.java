package Model.controller.album_new.dto.response;

import java.util.Arrays;
import java.util.UUID;

public record AlbumSearchResponseDto(
        UUID id,
        String title,
        String nameArtist,
        byte[] coverImage

) {
    @Override
    public String toString() {
        return "AlbumSearchResponseDto{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", nameArtist='" + nameArtist + '\'' +
                ", coverImage=" + Arrays.toString(coverImage) +
                '}';
    }
}
