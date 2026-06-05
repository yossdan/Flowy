package Model.controller.artist_new.dto.request;

import java.util.UUID;

public record UpdateArtistNameRequestDto(
        UUID userId,
        String artistName) {
}