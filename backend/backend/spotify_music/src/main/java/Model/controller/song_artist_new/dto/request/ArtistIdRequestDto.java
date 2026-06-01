package Model.controller.song_artist_new.dto.request;

import java.util.UUID;

public class ArtistIdRequestDto {

    private UUID artistId;

    public ArtistIdRequestDto() {
    }

    public ArtistIdRequestDto(UUID artistId) {
        this.artistId = artistId;
    }

    public UUID getArtistId() {
        return artistId;
    }

    public void setArtistId(UUID artistId) {
        this.artistId = artistId;
    }

    @Override
    public String toString() {
        return "ArtistIdRequestDto{" +
                "artistId=" + artistId +
                '}';
    }
}