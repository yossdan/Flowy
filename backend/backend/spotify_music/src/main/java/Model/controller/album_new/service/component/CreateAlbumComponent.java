package Model.controller.album_new.service.component;


import Model.controller.album_detail_new.service.components.CreateAlbumDetailComponent;
import Model.controller.album_new.dto.request.CreateAlbumRequestDto;
import Model.controller.album_new.entities.AlbumEntity;
import Model.controller.album_new.repository.AlbumQueryRepository;
import Model.controller.album_new.util.AlbumCoverCloudUploader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Component
public class CreateAlbumComponent {
    private final AlbumCoverCloudUploader  albumCoverCloudUploader;
    private final AlbumQueryRepository queryRepository;
    private final CreateAlbumDetailComponent createAlbumDetailComponent;

    @Autowired
    public CreateAlbumComponent(AlbumCoverCloudUploader albumCoverCloudUploader, AlbumQueryRepository queryRepository, CreateAlbumDetailComponent createAlbumDetailComponent) {
        this.albumCoverCloudUploader = albumCoverCloudUploader;
        this.queryRepository = queryRepository;
        this.createAlbumDetailComponent = createAlbumDetailComponent;
    }

    public void createAlbum(CreateAlbumRequestDto dto, MultipartFile coverFile, List<MultipartFile> songFiles) throws Exception {
        String coverImageObjectKey = albumCoverCloudUploader.uploadCoverPhoto(dto.getTitle(), coverFile);
        System.out.println("Subi la imagen a la nube");
        AlbumEntity albumEntity = queryRepository.createAlbum(dto, coverImageObjectKey);
        System.out.println("Subi la imagen a la nube");

        createAlbumDetailComponent.uploadMusic(albumEntity, dto.getSongs(), songFiles);
    }
}
