package Model.controller.artist_new.service;

import Model.controller.artist_new.dto.request.RegisterArtistRequestDto;
import Model.controller.artist_new.dto.response.ArtistResponseDto;
import Model.controller.artist_new.service.components.CreateArtistComponent;
import Model.controller.artist_new.service.components.SearchArtistComponent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArtistService {
    private final CreateArtistComponent createArtistComponent;
    private final SearchArtistComponent searchArtistComponent;
    @Autowired
    public ArtistService(CreateArtistComponent createArtistComponent, SearchArtistComponent searchArtistComponent) {
        this.createArtistComponent = createArtistComponent;
        this.searchArtistComponent = searchArtistComponent;
    }

    public void createArtist(RegisterArtistRequestDto dto){
        createArtistComponent.createArtist(dto);
    }
    public List<ArtistResponseDto> findAllArtists(){
        return searchArtistComponent.findAllArtists();
    }
    public List<ArtistResponseDto> findAllArtistsByName(String keyword){
        return searchArtistComponent.searchAllArtistsByName(keyword);
    }

}
