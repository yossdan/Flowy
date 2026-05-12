package Model.controller.artist_new.service.components;


import Model.controller.artist_new.dto.request.RegisterArtistRequestDto;
import Model.controller.artist_new.repository.ArtistQueryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CreateArtistComponent {
    private final ArtistQueryRepository repository;
    @Autowired
    public CreateArtistComponent(ArtistQueryRepository repository) {
        this.repository = repository;
    }
    public void createArtist(RegisterArtistRequestDto dto) {
        repository.createArtist(dto);
    }


}
