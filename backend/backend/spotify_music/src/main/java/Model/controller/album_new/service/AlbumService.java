package Model.controller.album_new.service;

import Model.controller.album_new.dto.request.CreateAlbumRequestDto;
import Model.controller.album_new.dto.response.AlbumSearchResponseDto;
import Model.controller.album_new.entities.AlbumEntity;
import Model.controller.album_new.service.component.CreateAlbumComponent;
import Model.controller.album_new.service.component.SearchAlbumComponent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
public class AlbumService {
    private final CreateAlbumComponent createAlbumComponent;
    private final SearchAlbumComponent searchAlbumComponent;
    @Autowired
    public AlbumService(CreateAlbumComponent createAlbumComponent, SearchAlbumComponent searchAlbumComponent) {
        this.createAlbumComponent = createAlbumComponent;
        this.searchAlbumComponent = searchAlbumComponent;
    }
    public void createAlbum(CreateAlbumRequestDto dto, MultipartFile coverFile, List<MultipartFile> songFiles) throws Exception {
        createAlbumComponent.createAlbum(dto, coverFile, songFiles);
    }
    public List<AlbumSearchResponseDto> searchAlbumsByKeyword(String keyword){
        return searchAlbumComponent.searchAlbumsByKeyword(keyword);
    }
}
