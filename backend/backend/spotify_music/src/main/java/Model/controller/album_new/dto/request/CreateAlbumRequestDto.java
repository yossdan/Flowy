package Model.controller.album_new.dto.request;




import Model.controller.album_detail_new.dto.request.SongRequestDto;

import java.util.List;
import java.util.UUID;

public class CreateAlbumRequestDto {
    private UUID userId;
    private String title;

    private List<SongRequestDto> songs;

    public CreateAlbumRequestDto(UUID userId, String title, List<SongRequestDto> songs) {
        this.userId = userId;
        this.title = title;
        this.songs = songs;
    }

    public CreateAlbumRequestDto(UUID userId, String title) {
        this.userId = userId;
        this.title = title;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }





    public List<SongRequestDto> getSongs() {
        return songs;
    }

    public void setSongs(List<SongRequestDto> songs) {
        this.songs = songs;
    }

    @Override
    public String toString() {
        return "CreateAlbumRequestDto{" +
                "userId=" + userId +
                ", title='" + title + '\'' +
                ", songs=" + songs +
                '}';
    }
}
