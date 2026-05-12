package Model.controller.album_detail_new.service.components;




import Model.controller.album_detail_new.dto.request.SongRequestDto;
import Model.controller.album_detail_new.entities.AlbumDetailEntity;
import Model.controller.album_detail_new.repository.AlbumDetailQueryRepository;
import Model.controller.album_detail_new.util.AlbumMusicCloudUploader;
import Model.controller.album_new.entities.AlbumEntity;
import Model.controller.song_artist_new.service.components.CreateSongArtistComponent;
import Model.controller.song_genre_new.service.components.CreateSongGenreComponent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Component
public class CreateAlbumDetailComponent {

    private final AlbumDetailQueryRepository albumDetailQueryRepository;
    private final AlbumMusicCloudUploader cloudClient;

    private final CreateSongArtistComponent createSongArtistComponent;
    private final CreateSongGenreComponent createSongGenreComponent;


    public CreateAlbumDetailComponent(AlbumDetailQueryRepository albumDetailQueryRepository, AlbumMusicCloudUploader cloudClient, CreateSongArtistComponent createSongArtistComponent, CreateSongGenreComponent createSongGenreComponent) {
        this.albumDetailQueryRepository = albumDetailQueryRepository;
        this.cloudClient = cloudClient;
        this.createSongArtistComponent = createSongArtistComponent;
        this.createSongGenreComponent = createSongGenreComponent;
    }
    public void uploadMusic (AlbumEntity albumEntity, List<SongRequestDto> songs, List<MultipartFile> songFiles) throws Exception {
        Map<String, String> musicKeys = cloudClient.uploadMusicToCloud(albumEntity.getId(), songs, songFiles);
        songs.forEach(song -> {
            String musicTitle = song.getTitle();
            String audioObjectKey = musicKeys.get(musicTitle);
            AlbumDetailEntity albumDetailEntity = albumDetailQueryRepository.saveMusic(albumEntity, musicTitle, audioObjectKey);
            if(!song.getArtistIds().isEmpty()){
                createSongArtistComponent.saveSongCollaborators(albumDetailEntity, song.getArtistIds());
            }
            if(!song.getGenreIds().isEmpty()){
                createSongGenreComponent.saveSongGenres(albumDetailEntity, song.getGenreIds());
            }
        });
    }

}
