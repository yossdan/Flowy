package Model.controller.album_detail_new.service;

import Model.controller.album_detail_new.dto.response.SongsResponseDto;
import Model.controller.album_detail_new.service.components.SearchAlbumDetailComponent;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AlbumDetailService {
    private final SearchAlbumDetailComponent searchAlbumDetailComponent;

    public AlbumDetailService(SearchAlbumDetailComponent searchAlbumDetailComponent) {
        this.searchAlbumDetailComponent = searchAlbumDetailComponent;
    }

    public List<SongsResponseDto> findAllSongsByAlbum(UUID albumId){
        return searchAlbumDetailComponent.findAllSongsByAlbum(albumId);
    }
    public byte[] getSongById(UUID songId){
        return searchAlbumDetailComponent.getSongById(songId);
    }
}
