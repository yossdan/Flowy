package Model.controller.artist_new;

import Model.controller.artist_new.dto.request.RegisterArtistRequestDto;
import Model.controller.artist_new.service.ArtistService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/artists")
public class ArtistController {

    private final ArtistService service;

    public ArtistController(ArtistService service) {
        this.service = service;
    }
    @PostMapping("/create")
    public String createArtist(@ModelAttribute RegisterArtistRequestDto dto) {
        service.createArtist(dto);
        return "redirect:/artists";
    }


}