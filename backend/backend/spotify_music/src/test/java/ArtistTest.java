import App.App;

import Model.controller.artist_new.dto.request.RegisterArtistRequestDto;
import Model.controller.artist_new.dto.response.ArtistResponseDto;
import Model.controller.artist_new.entities.ArtistEntity;
import Model.controller.artist_new.repository.ArtistRepository;
import Model.controller.artist_new.service.ArtistService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.UUID;

@SpringBootTest(classes = App.class)
public class ArtistTest {
    @Autowired
    private ArtistService artistService;




    @Test
    void registerArtist(){
        UUID id = UUID.randomUUID();
        String artistName = "Elton John";
        artistService.createArtist(new RegisterArtistRequestDto(id,artistName));
    }



    @Test
    void findAllArtists(){
        List<ArtistResponseDto> dtos = artistService.findAllArtists();
        dtos.forEach(System.out::println);
    }

    @Test
    void findAllArtistsByName (){
        List<ArtistResponseDto> dtos = artistService.findAllArtistsByName("Jo");
        dtos.forEach(System.out::println);
    }
}
