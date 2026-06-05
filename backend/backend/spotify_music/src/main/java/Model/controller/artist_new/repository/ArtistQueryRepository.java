package Model.controller.artist_new.repository;

import Model.controller.artist_new.dto.request.RegisterArtistRequestDto;
import Model.controller.artist_new.entities.ArtistEntity;
import Model.controller.artist_new.exception.ArtistException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
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
        if (dto.userId() == null) {
            throw new ArtistException("El usuario es obligatorio para crear un artista.");
        }

        if (dto.artistName() == null || dto.artistName().trim().isEmpty()) {
            throw new ArtistException("El nombre del artista no puede estar vacío.");
        }

        String cleanArtistName = dto.artistName().trim();

        Optional<ArtistEntity> existingArtistByUser = repository.findByUserId(dto.userId());

        if (existingArtistByUser.isPresent()) {
            ArtistEntity artist = existingArtistByUser.get();

            if (Boolean.TRUE.equals(artist.getActive())) {
                throw new ArtistException(
                        "Este usuario ya está registrado como artista en nuestra plataforma. Si deseas gestionar tu perfil, ve a la configuración de tu cuenta o contacta con soporte si crees que hay un error.");
            }

            if (!artist.getName().equalsIgnoreCase(cleanArtistName)
                    && repository.existsByNameAndActiveTrue(cleanArtistName)) {
                throw new ArtistException(
                        "Ya existe un artista registrado con este nombre. Por favor, elige uno distinto para que tus fans puedan encontrarte sin problemas.");
            }

            artist.setName(cleanArtistName);
            artist.setActive(true);
            artist.setUpdatedAt(OffsetDateTime.now());

            repository.save(artist);
            return;
        }

        if (repository.existsByNameAndActiveTrue(cleanArtistName)) {
            throw new ArtistException(
                    "Ya existe un artista registrado con este nombre. Por favor, elige uno distinto para que tus fans puedan encontrarte sin problemas.");
        }

        repository.save(new ArtistEntity(dto.userId(), cleanArtistName));
    }

    public List<ArtistEntity> findAllArtists() {
        return repository.findAllByActiveTrue();
    }

    public List<ArtistEntity> findAllArtistsByName(String keyword) {
        return repository.findAllByNameStartingWithIgnoreCaseAndActiveTrue(keyword);
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
        return repository.existsByUserIdAndActiveTrue(userId);
    }

    @Transactional
    public void deleteArtistByUserId(UUID userId) {
        ArtistEntity artist = repository.findByUserId(userId)
                .orElseThrow(() -> new ArtistException("No se encontró el artista de este usuario."));

        artist.setActive(false);
        artist.setUpdatedAt(OffsetDateTime.now());

        repository.save(artist);
    }

    @Transactional
    public void updateArtistNameByUserId(UUID userId, String artistName) {
        if (userId == null) {
            throw new ArtistException("El usuario es obligatorio.");
        }

        if (artistName == null || artistName.trim().isEmpty()) {
            throw new ArtistException("El nombre del artista no puede estar vacío.");
        }

        String cleanArtistName = artistName.trim();

        ArtistEntity artist = repository.findByUserId(userId)
                .orElseThrow(() -> new ArtistException("No se encontró el artista de este usuario."));

        if (!artist.getName().equalsIgnoreCase(cleanArtistName)
                && repository.existsByNameAndActiveTrue(cleanArtistName)) {
            throw new ArtistException("Ya existe un artista activo con ese nombre.");
        }

        artist.setName(cleanArtistName);
        artist.setUpdatedAt(OffsetDateTime.now());

        repository.save(artist);
    }
}