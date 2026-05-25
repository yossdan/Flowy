package Model.controller.album_new;


import Model.controller.album_new.dto.request.CreateAlbumRequestDto;
import Model.controller.album_new.dto.response.CreateAlbumResponseDto;
import Model.controller.album_new.service.AlbumService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/album")
public class AlbumController {
    private final AlbumService service;

    public AlbumController(AlbumService service) {
        this.service = service;
    }

    @PostMapping(
            value = "/create",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<CreateAlbumResponseDto> createAlbum(
            @RequestPart("album") CreateAlbumRequestDto dto,
            @RequestPart("coverFile") MultipartFile coverFile,
            @RequestPart("songFiles") List<MultipartFile> songFiles
    ) throws Exception {

        service.createAlbum(dto, coverFile, songFiles);

        CreateAlbumResponseDto response = new CreateAlbumResponseDto(
                "Álbum creado correctamente"
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
