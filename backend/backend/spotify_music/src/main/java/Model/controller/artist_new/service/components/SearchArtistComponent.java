package Model.controller.artist_new.service.components;

import Model.controller.album_detail_new.dto.response.SongsResponseDto;
import Model.controller.album_detail_new.service.components.SearchAlbumDetailComponent;
import Model.controller.album_new.dto.response.AlbumResponseDto;
import Model.controller.album_new.entities.AlbumEntity;
import Model.controller.album_new.service.component.SearchAlbumComponent;
import Model.controller.artist_new.dto.response.ArtistDetailResponseDto;
import Model.controller.artist_new.dto.response.ArtistResponseDto;
import Model.controller.artist_new.entities.ArtistEntity;
import Model.controller.artist_new.repository.ArtistQueryRepository;
import Model.controller.artist_new.utils.ArtistPhotoCloudService;
import Model.controller.search.enums.SearchType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
public class SearchArtistComponent {
    private final ArtistQueryRepository repository;
    private final SearchAlbumComponent  searchAlbumComponent;
    private final SearchAlbumDetailComponent searchAlbumDetailComponent;
    private final ArtistPhotoCloudService profilePhotoService;

    @Autowired
    public SearchArtistComponent(ArtistQueryRepository repository, SearchAlbumComponent searchAlbumComponent, SearchAlbumDetailComponent searchAlbumDetailComponent, ArtistPhotoCloudService profilePhotoService) {
        this.repository = repository;
        this.searchAlbumComponent = searchAlbumComponent;
        this.searchAlbumDetailComponent = searchAlbumDetailComponent;
        this.profilePhotoService = profilePhotoService;
    }

    public boolean existsByUserId(UUID userId) {
        return repository.existsByUserId(userId);
    }

    public void deleteArtistByUserId(UUID userId) {
        repository.deleteArtistByUserId(userId);
    }

    public List<ArtistResponseDto> findAllArtists() {
        List<ArtistEntity> artists = repository.findAllArtists();

        if (!artists.isEmpty()) {
            Map<UUID, byte[]> profilePhotos = profilePhotoService.getProfilePhotos(artists);
            return artists.stream()
                    .map(entity -> {
                        byte[] profilePhoto = profilePhotos.get(entity.getId());
                        return new ArtistResponseDto(entity.getId(), entity.getName(), profilePhoto, SearchType.ARTIST);
                    }).toList();
        }

        return new ArrayList<>();
    }

    public List<ArtistResponseDto> searchAllArtistsByName(String keyword) {
        List<ArtistEntity> artists = repository.findAllArtistsByName(keyword);

        if (!artists.isEmpty()) {
            Map<UUID, byte[]> profilePhotos = profilePhotoService.getProfilePhotos(artists);

            return artists.stream()
                    .map(entity -> {
                        byte[] profilePhoto = profilePhotos.get(entity.getUserId());
                        return new ArtistResponseDto(entity.getId(), entity.getName(), profilePhoto, SearchType.ARTIST);
                    }).toList();
        }

        return new ArrayList<>();
    }

    public ArtistDetailResponseDto getArtistDetails(UUID artistId){
        ArtistEntity artistEntity = repository.getArtistById(artistId);
        List<AlbumEntity> albumsEntities = searchAlbumComponent.getAlbumsByArtistId(artistEntity);
        Map<String, byte[]> albumPhotos = searchAlbumComponent.fetchAlbumCoversFromCloud(albumsEntities);
        List<AlbumResponseDto> albumsResponse = albumsEntities.stream()
            .map(albumEntity -> {
                UUID id = albumEntity.getId();
                String title = albumEntity.getTitle();
                byte[] coverPhoto = albumPhotos.get(title);
                List<SongsResponseDto> bestSongsByAlbum = searchAlbumDetailComponent.findBestSongsByAlbum(albumEntity);
                return new AlbumResponseDto(id, title, coverPhoto, bestSongsByAlbum);
            }).toList();
        return new ArtistDetailResponseDto(artistEntity.getName(), albumsResponse);
    }

}