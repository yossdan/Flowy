package Model.controller.album_new.dto.response;



import Model.controller.album_detail_new.dto.response.SongsResponseDto;

import java.util.List;
import java.util.UUID;

public class AlbumResponseDto {
    private UUID albumId;
    private String albumName;
    private byte[] coverPhoto;
    private List<SongsResponseDto> bestSongsByAlbum;

    public AlbumResponseDto() {
    }

    public AlbumResponseDto(UUID albumId,String albumName, byte[] coverPhoto, List<SongsResponseDto> bestSongsByAlbum) {
        this.albumId = albumId;
        this.albumName = albumName;
        this.coverPhoto = coverPhoto;
        this.bestSongsByAlbum = bestSongsByAlbum;
    }

    public UUID getAlbumId() {
        return albumId;
    }

    public void setAlbumId(UUID albumId) {
        this.albumId = albumId;
    }

    public String getAlbumName() {
        return albumName;
    }

    public void setAlbumName(String albumName) {
        this.albumName = albumName;
    }

    public byte[] getCoverPhoto() {
        return coverPhoto;
    }

    public void setCoverPhoto(byte[] coverPhoto) {
        this.coverPhoto = coverPhoto;
    }

    public List<SongsResponseDto> getBestSongsByAlbum() {
        return bestSongsByAlbum;
    }

    public void setBestSongsByAlbum(List<SongsResponseDto> bestSongsByAlbum) {
        this.bestSongsByAlbum = bestSongsByAlbum;
    }
}
