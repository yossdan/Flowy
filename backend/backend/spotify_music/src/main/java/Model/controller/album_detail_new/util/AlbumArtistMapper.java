package Model.controller.album_detail_new.util;


import Model.controller.album_new.entities.AlbumEntity;
import Model.controller.album_new.repository.AlbumQueryRepository;

import Model.controller.artist_new.entities.ArtistEntity;
import Model.controller.artist_new.repository.ArtistQueryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class AlbumArtistMapper {
    private final ArtistQueryRepository artistQueryRepository;
    private final AlbumQueryRepository albumQueryRepository;

    @Autowired
    public AlbumArtistMapper(ArtistQueryRepository artistQueryRepository, AlbumQueryRepository albumQueryRepository) {
        this.artistQueryRepository = artistQueryRepository;
        this.albumQueryRepository = albumQueryRepository;
    }

    public HashMap<UUID, String> findArtistsByAlbums(List<AlbumEntity> albumEntities) {

        Set<UUID> artistIds = albumEntities.stream().map(album -> album.getArtistId().getId()).collect(Collectors.toSet());
        List<ArtistEntity> artistEntities = artistQueryRepository.findArtistById(artistIds);

        return albumEntities.stream().collect(Collectors.toMap(
                AlbumEntity::getId,
                albumEntity -> {
                    String name = artistEntities.stream()
                            .filter(artist -> artist.getId() == albumEntity.getArtistId().getId())
                            .map(ArtistEntity::getName)
                            .findFirst()
                            .orElse(null);
                    return name;},
                (artist1, artist2) -> artist1,
                HashMap::new
        ));
    }
}
