package Model.controller.album_new.service.component;


import Model.controller.album_new.dto.response.AlbumSearchResponseDto;
import Model.controller.album_new.entities.AlbumEntity;
import Model.controller.album_new.repository.AlbumQueryRepository;
import Model.controller.album_new.util.AlbumCoverCloudFetcher;
import Model.controller.artist_new.entities.ArtistEntity;
import Model.controller.artist_new.repository.ArtistQueryRepository;
import Model.controller.search.enums.SearchType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class SearchAlbumComponent {
    private final AlbumQueryRepository albumQueryRepository;
    private final ArtistQueryRepository artistQueryRepository;
    private final AlbumCoverCloudFetcher albumCoverCloudFetcher;

    @Autowired
    public SearchAlbumComponent(AlbumQueryRepository albumQueryRepository, AlbumCoverCloudFetcher albumCoverCloudFetcher, ArtistQueryRepository artistQueryRepository) {
        this.albumQueryRepository = albumQueryRepository;
        this.albumCoverCloudFetcher = albumCoverCloudFetcher;
        this.artistQueryRepository = artistQueryRepository;
    }

    public List<AlbumSearchResponseDto> searchAlbumsByKeyword(String keyword){
        List<AlbumEntity> albumEntities = albumQueryRepository.searchAlbumsByKeyword(keyword);

        if(!albumEntities.isEmpty()){
            Map<String, byte[]> albumPhotos = albumCoverCloudFetcher.fetchAlbumCoversFromCloud(albumEntities);
            List<UUID> artistIds = albumEntities.stream().map(album -> album.getArtistId().getId()).toList();
            List<ArtistEntity> artistEntities = artistQueryRepository.findArtistById(artistIds);

            System.out.println("Artistas encontrados?" + artistEntities.isEmpty());

            return albumEntities.stream().map(album -> {
                byte [] coverImage = albumPhotos.get(album.getCoverImageObjectKey());
                String artistName = artistEntities
                        .stream()
                        .filter(artist -> Objects.equals(artist.getId(), album.getArtistId().getId()))
                        .map(ArtistEntity::getName)
                        .findFirst()
                        .orElse(null);

                return new AlbumSearchResponseDto(album.getId(), album.getTitle(),artistName,coverImage, SearchType.ALBUM);
            }).toList();
        }
        return  new ArrayList<>();
    }
    public List<AlbumEntity> getAlbumsByArtistId(ArtistEntity artistId) {
        return albumQueryRepository.getAlbumsByArtistId(artistId);
    }
    public Map<String, byte[]> fetchAlbumCoversFromCloud(List<AlbumEntity> albumEntities){
        return  albumCoverCloudFetcher.fetchAlbumCoversFromCloud(albumEntities);
    }

}
