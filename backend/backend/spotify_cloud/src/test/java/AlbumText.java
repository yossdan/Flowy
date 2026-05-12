import App.App;
import Model.controller.music.dto.request.SongRequestDto;
import Model.controller.music.service.MusicService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@SpringBootTest(
        classes = App.class,
        properties = {
                "cloudflare.r2.account-id=5ec9f021d8a08e548dd1f57d59de2f0b",
                "cloudflare.r2.access-key=cd0ad266a112bbb73c5ec919583320c0",
                "cloudflare.r2.secret-key=7aaedfe83f83dcd4e606d774161902e9142f9f07a242f6450820544924aabdb9",
                "cloudflare.r2.bucket=music-app-dev"
        }
)
public class AlbumText {

    @Autowired
    private MusicService musicService;

    @Test
    void uploadAlbumDetail() throws Exception {
        Path path2 = Paths.get("C:\\Users\\migue\\Downloads\\Elton John - I'm Still Standing ft. Eric Clapton (The Prince's Trust Rock Gala 1986).mp3");
        byte[] music = Files.readAllBytes(path2);

        MockMultipartFile musicFile = new MockMultipartFile(
                "musicFile",
                "audio.mp3",
                "audio/mpeg",
                music
        );

        List<SongRequestDto> songs = List.of(
                new SongRequestDto("Im Still Standing")
        );

        List<MultipartFile> files = List.of(musicFile);

        UUID id = UUID.randomUUID();

        musicService.uploadSongs(id, songs, files);
    }
}