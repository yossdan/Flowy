package Model.controller.album_new.dto.response;

public class CreateAlbumResponseDto {
    private String msg;
    public CreateAlbumResponseDto(String msg) {
        this.msg = msg;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
