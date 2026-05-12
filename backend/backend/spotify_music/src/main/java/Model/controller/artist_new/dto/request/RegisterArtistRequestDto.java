package Model.controller.artist_new.dto.request;

import java.util.UUID;

public record RegisterArtistRequestDto (
    UUID userId,
    String artistName
)
{

}
