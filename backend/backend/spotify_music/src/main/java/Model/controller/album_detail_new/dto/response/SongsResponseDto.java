package Model.controller.album_detail_new.dto.response;

import java.util.UUID;

public class SongsResponseDto {
    private UUID songId;
    private String songTitle;

    public SongsResponseDto() {
    }

    public SongsResponseDto(UUID songId, String songTitle) {
        this.songId = songId;
        this.songTitle = songTitle;
    }

    public UUID getSongId() {
        return songId;
    }

    public void setSongId(UUID songId) {
        this.songId = songId;
    }

    public String getSongTitle() {
        return songTitle;
    }

    public void setSongTitle(String songTitle) {
        this.songTitle = songTitle;
    }
}
