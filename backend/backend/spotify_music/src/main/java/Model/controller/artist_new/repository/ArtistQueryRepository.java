package Model.controller.artist_new.repository;

import Model.controller.artist_new.dto.request.RegisterArtistRequestDto;
import Model.controller.artist_new.entities.ArtistEntity;
import Model.controller.artist_new.exception.ArtistException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class ArtistQueryRepository {

    private final ArtistRepository repository;

    @Autowired
    public ArtistQueryRepository(ArtistRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void createArtist(RegisterArtistRequestDto dto) {

        if (repository.existsByUserId(dto.userId())) {
            throw new ArtistException(
                    "Este usuario ya está registrado como artista en nuestra plataforma. Si deseas gestionar tu perfil, ve a la configuración de tu cuenta o contacta con soporte si crees que hay un error.");
        }
        if (repository.existsByName(dto.artistName())) {
            throw new ArtistException(
                    "Ya existe un artista registrado con este nombre. Por favor, elige uno distinto para que tus fans puedan encontrarte sin problemas.");
        }
        repository.save(new ArtistEntity(dto.userId(), dto.artistName()));
    }

    public List<ArtistEntity> findAllArtists() {
        return repository.findAll();
    }

    public List<ArtistEntity> findAllArtistsByName(String keyword) {
        return repository.findAllByNameStartingWithIgnoreCase(keyword);
    }

    public Optional<ArtistEntity> findArtistByUserId(UUID userId) {
        return repository.findByUserId(userId);
    }

    public List<ArtistEntity> findArtistById(Collection<UUID> artistIds) {
        return repository.findAllById(artistIds);
    }

    public ArtistEntity getArtistById(UUID artistId) {
        return repository.findById(artistId).orElse(null);
    }


    public boolean existsByUserId(UUID userId) {
        return repository.existsByUserId(userId);
    }

    @Transactional
    public void deleteArtistByUserId(UUID userId) {
        repository.deleteByUserId(userId);
    }

}
