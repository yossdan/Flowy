package Model.controller.song_artist_new.dto.request;

import java.util.UUID;

public record ArtistIdRequestDto(
        UUID artistId
) {

    public UUID getArtistId() {
        return artistId;
    }
}
