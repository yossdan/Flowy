package Model.controller.album_detail_new.dto.response;

import Model.controller.search.enums.SearchType;

import java.util.UUID;

public record SongSearchResponseDto (
        UUID id,
        String title,
        String nameArtist,
        byte[] coverImage,
        SearchType type
)
{
}
