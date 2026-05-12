package Model.controller.search.dto.response;

import Model.controller.album_detail_new.dto.response.SongSearchResponseDto;
import Model.controller.album_new.dto.response.AlbumSearchResponseDto;
import Model.controller.artist_new.dto.response.ArtistResponseDto;

import java.util.List;

public record SearchResponseDto(
        List<ArtistResponseDto> artistSearches,
        List<AlbumSearchResponseDto> albumSearches,
        List<SongSearchResponseDto> songSearches

) {
    @Override
    public String toString() {
        return "SearchResponseDto{" +
                "artistSearches=" + artistSearches +
                ", albumSearches=" + albumSearches +
                ", songSearches=" + songSearches +
                '}';
    }
}
