package Model.controller.artist_new.dto.response;

import Model.controller.album_new.dto.response.AlbumResponseDto;

import java.util.List;

public class ArtistDetailResponseDto {
    private String artistName;
    private byte[] profilePhoto;
    private List<AlbumResponseDto> albums;

    public ArtistDetailResponseDto() {
    }

    public ArtistDetailResponseDto(String artistName, byte[] profilePhoto, List<AlbumResponseDto> albums) {
        this.artistName = artistName;
        this.profilePhoto = profilePhoto;
        this.albums = albums;
    }

    public String getArtistName() {
        return artistName;
    }

    public void setArtistName(String artistName) {
        this.artistName = artistName;
    }

    public byte[] getProfilePhoto() {
        return profilePhoto;
    }

    public void setProfilePhoto(byte[] profilePhoto) {
        this.profilePhoto = profilePhoto;
    }

    public List<AlbumResponseDto> getAlbums() {
        return albums;
    }

    public void setAlbums(List<AlbumResponseDto> albums) {
        this.albums = albums;
    }
}