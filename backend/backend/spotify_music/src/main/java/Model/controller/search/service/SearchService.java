package Model.controller.search.service;

import Model.controller.album_detail_new.dto.response.SongSearchResponseDto;
import Model.controller.album_detail_new.service.components.SearchAlbumDetailComponent;
import Model.controller.album_new.dto.response.AlbumSearchResponseDto;
import Model.controller.album_new.service.component.SearchAlbumComponent;
import Model.controller.artist_new.dto.response.ArtistResponseDto;
import Model.controller.artist_new.service.components.SearchArtistComponent;
import Model.controller.search.dto.response.SearchResponseDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchService {
    private final SearchArtistComponent searchArtistComponent;
    private final SearchAlbumComponent searchAlbumComponent;
    private final SearchAlbumDetailComponent searchAlbumDetailComponent;

    public SearchService(SearchArtistComponent searchArtistComponent, SearchAlbumComponent searchAlbumComponent, SearchAlbumDetailComponent searchAlbumDetailComponent) {
        this.searchArtistComponent = searchArtistComponent;
        this.searchAlbumComponent = searchAlbumComponent;
        this.searchAlbumDetailComponent = searchAlbumDetailComponent;
    }
    public SearchResponseDto generalSearch(String keyword) {
        List<ArtistResponseDto> artistSearches = searchArtistComponent.searchAllArtistsByName(keyword);
        List<AlbumSearchResponseDto> albumSearches = searchAlbumComponent.searchAlbumsByKeyword(keyword);
        List<SongSearchResponseDto> songSearches  = searchAlbumDetailComponent.searchSongsByKeyword(keyword);
        return new SearchResponseDto(artistSearches, albumSearches, songSearches);
    }
}
