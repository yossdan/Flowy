package Model.controller.music.dto.request;

import org.springframework.web.multipart.MultipartFile;

public class SongRequestDto {
    private String title;

    public SongRequestDto(String title) {
        this.title = title;

    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }



    @Override
    public String toString() {
        return "SongRequestDto{" +
                "title='" + title + '\'' +
                '}';
    }
}