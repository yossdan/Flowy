package Model.controller.artist_new.service.components;

import Model.controller.artist_new.dto.response.ArtistResponseDto;
import Model.controller.artist_new.entities.ArtistEntity;
import Model.controller.artist_new.repository.ArtistQueryRepository;
import Model.controller.artist_new.utils.ArtistPhotoCloudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
public class SearchArtistComponent {
    private final ArtistQueryRepository repository;
    private final ArtistPhotoCloudService profilePhotoService;

    @Autowired
    public SearchArtistComponent(ArtistQueryRepository repository, ArtistPhotoCloudService profilePhotoService) {
        this.repository = repository;
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
                        return new ArtistResponseDto(entity.getId(), entity.getName(), profilePhoto);
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
                        return new ArtistResponseDto(entity.getId(), entity.getName(), profilePhoto);
                    }).toList();
        }

        return new ArrayList<>();
    }
}