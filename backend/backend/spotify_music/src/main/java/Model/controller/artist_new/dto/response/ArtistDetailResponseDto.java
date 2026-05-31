package Model.controller.artist_new.dto.response;

import Model.controller.album_new.dto.response.AlbumResponseDto;

import java.util.List;

public class ArtistDetailResponseDto {
    private String artistName;
    private List<AlbumResponseDto> albums;

    public ArtistDetailResponseDto() {
    }

    public ArtistDetailResponseDto(String artistName,List<AlbumResponseDto> albums) {
        this.albums = albums;
        this.artistName = artistName;
    }

    public String getArtistName() {
        return artistName;
    }

    public void setArtistName(String artistName) {
        this.artistName = artistName;
    }

    public List<AlbumResponseDto> getAlbums() {
        return albums;
    }

    public void setAlbums(List<AlbumResponseDto> albums) {
        this.albums = albums;
    }
}
