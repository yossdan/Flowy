package Model.controller.album_detail_new.service.components;

import Model.controller.album_detail_new.dto.response.SongSearchResponseDto;
import Model.controller.album_detail_new.dto.response.SongsResponseDto;
import Model.controller.album_detail_new.entities.AlbumDetailEntity;
import Model.controller.album_detail_new.repository.AlbumDetailQueryRepository;
import Model.controller.album_detail_new.util.AlbumArtistMapper;
import Model.controller.album_detail_new.util.AlbumMusicCloudFetcher;
import Model.controller.album_new.entities.AlbumEntity;
import Model.controller.album_new.repository.AlbumQueryRepository;
import Model.controller.artist_new.entities.ArtistEntity;
import Model.controller.search.enums.SearchType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class SearchAlbumDetailComponent {
    private final AlbumDetailQueryRepository repository;
    private final AlbumMusicCloudFetcher cloudClient;

    private final AlbumQueryRepository albumQueryRepository;

    private final AlbumArtistMapper albumArtistMapper;

    @Autowired
    public SearchAlbumDetailComponent(AlbumDetailQueryRepository repository, AlbumMusicCloudFetcher cloudClient,
            AlbumQueryRepository albumQueryRepository, AlbumArtistMapper albumArtistMapper) {
        this.repository = repository;
        this.cloudClient = cloudClient;
        this.albumQueryRepository = albumQueryRepository;
        this.albumArtistMapper = albumArtistMapper;

    }

    public List<SongSearchResponseDto> searchSongsByKeyword(String keyword) {
        List<AlbumDetailEntity> musicEntities = repository.findMusicByKeyword(keyword);

        Set<UUID> albumIds = musicEntities.stream()
                .map(song -> song.getAlbumId().getId())
                .collect(Collectors.toSet());

        List<AlbumEntity> albumEntities = albumQueryRepository.findAlbumsByIds(albumIds);

        HashMap<UUID, String> artistsByAlbums = albumArtistMapper.findArtistsByAlbums(albumEntities);

        Map<String, byte[]> albumPhotosFromCloud = cloudClient.getAlbumPhotosFromCloud(albumEntities);

        return musicEntities.stream().map(song -> {
            UUID albumId = song.getAlbumId().getId();

            String nameArtist = artistsByAlbums.get(albumId);

            AlbumEntity album = albumEntities.stream()
                    .filter(item -> item.getId().equals(albumId))
                    .findFirst()
                    .orElse(null);

            String albumName = album != null ? album.getTitle() : "Sin álbum";

            String coverImageObjectKey = album != null
                    ? album.getCoverImageObjectKey()
                    : null;

            byte[] coverImage = albumPhotosFromCloud.get(coverImageObjectKey);

            return new SongSearchResponseDto(
                    song.getId(),
                    song.getTitle(),
                    nameArtist,
                    albumName,
                    coverImage,
                    SearchType.SONG);
        }).toList();
    }

    public byte[] getSongById(UUID songId) {
        AlbumDetailEntity songEntity = repository.findMusicById(songId);
        return cloudClient.getSong(songEntity.getAudioObjectKey());
    }

    public List<SongsResponseDto> findBestSongsByAlbum(AlbumEntity album) {
        return repository.findTop2ByAlbum(album).stream()
                .map(albumDetailEntity -> new SongsResponseDto(albumDetailEntity.getId(), albumDetailEntity.getTitle()))
                .collect(Collectors.toList());
    }

    public List<SongsResponseDto> findAllSongsByAlbum(UUID albumId) {
        AlbumEntity albumEntity = albumQueryRepository.getAlbumById(albumId);
        List<AlbumDetailEntity> songs = repository.findAllSongsByAlbum(albumEntity);
        return songs.stream()
                .map(song -> new SongsResponseDto(song.getId(), song.getTitle()))
                .collect(Collectors.toList());
    }
}
