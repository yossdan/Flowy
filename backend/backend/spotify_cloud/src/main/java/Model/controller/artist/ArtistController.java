package Model.controller.artist;


import Model.controller.artist.service.ArtistService;
import Model.controller.users.dto.request.UserProfilePhotoRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import software.amazon.awssdk.services.s3.S3Client;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/artist")
public class ArtistController {

    @Autowired
    private ArtistService artistService;
    public ArtistController( ArtistService artistService) {
        this.artistService = artistService;
    }

    @PostMapping("/download/artistProfilePhoto")
    public ResponseEntity<Map<UUID, byte[]>> getArtistProfilePhoto(
            @RequestBody List<UserProfilePhotoRequestDto> userProfilePhotoRequestDto){
        Map<UUID, byte[]> artistProfilePhoto =  artistService.getArtistProfilePhoto(userProfilePhotoRequestDto);
        return ResponseEntity.ok(artistProfilePhoto);
    }

}
