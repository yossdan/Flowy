package Model.controller.album_detail_new.dto.response;

import java.util.UUID;

public record SongSearchResponseDto (
        UUID id,
        String title,
        String nameArtist,
        byte[] coverImage
)
{
}
