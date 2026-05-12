package Model.controller.song_artist_new.service.components;


import Model.controller.album_detail_new.entities.AlbumDetailEntity;
import Model.controller.artist_new.entities.ArtistEntity;
import Model.controller.artist_new.repository.ArtistQueryRepository;

import Model.controller.song_artist_new.dto.request.ArtistIdRequestDto;
import Model.controller.song_artist_new.repository.SongArtistQueryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class CreateSongArtistComponent {
    private final SongArtistQueryRepository songArtistQueryRepository;
    private final ArtistQueryRepository artistQueryRepository;
    @Autowired
    public  CreateSongArtistComponent(SongArtistQueryRepository songArtistQueryRepository, ArtistQueryRepository artistQueryRepository) {
        this.songArtistQueryRepository = songArtistQueryRepository;
        this.artistQueryRepository = artistQueryRepository;
    }

    public void saveSongCollaborators(AlbumDetailEntity songId, List<ArtistIdRequestDto> artistDtos){
        List<UUID> artistId = artistDtos.stream().map(ArtistIdRequestDto::getArtistId).toList();
        List<ArtistEntity> artistEntities = artistQueryRepository.findArtistById(artistId);
        songArtistQueryRepository.saveSongCollaborator(songId, artistEntities);
    }
}
