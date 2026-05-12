package Model.controller.album_new.repository;


import Model.controller.album_new.AlbumException;
import Model.controller.album_new.dto.request.CreateAlbumRequestDto;
import Model.controller.album_new.entities.AlbumEntity;
import Model.controller.artist_new.entities.ArtistEntity;
import Model.controller.artist_new.repository.ArtistQueryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public class AlbumQueryRepository {

    private final AlbumRepository repository;
    private final ArtistQueryRepository artistQueryRepository;
    @Autowired
    public AlbumQueryRepository(AlbumRepository repository, ArtistQueryRepository artistQueryRepository) {
        this.repository = repository;
        this.artistQueryRepository = artistQueryRepository;
    }
    public AlbumEntity createAlbum(CreateAlbumRequestDto dto, String coverImageObjectKey){
        Optional<ArtistEntity> optionalArtist = artistQueryRepository.findArtistByUserId(dto.getUserId());
        if(optionalArtist.isPresent()){
            ArtistEntity artistEntity = optionalArtist.get();
            return repository.save(new AlbumEntity(dto.getTitle(), artistEntity, coverImageObjectKey));
        }
        throw new AlbumException("No se pudo guardar correctamente el album en la BD");
    }

    public List<AlbumEntity> searchAlbumsByKeyword(String keyword){
        return repository.findByTitleStartingWithIgnoreCase(keyword);
    }
    public List<AlbumEntity> findAlbumsByIds(Set<UUID> albumIds){
        return repository.findAllById(albumIds);
    }
}
