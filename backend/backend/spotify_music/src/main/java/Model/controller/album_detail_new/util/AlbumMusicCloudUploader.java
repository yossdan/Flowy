package Model.controller.album_detail_new.util;


import Model.controller.album_detail_new.client.CloudAlbumDetailClient;
import Model.controller.album_detail_new.dto.request.SongRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AlbumMusicCloudUploader {
    private final CloudAlbumDetailClient cloudClient;
    @Autowired
    public AlbumMusicCloudUploader(CloudAlbumDetailClient cloudClient) {
        this.cloudClient = cloudClient;
    }
    public Map<String, String> uploadMusicToCloud(UUID albumId, List<SongRequestDto> songs, List<MultipartFile> songFiles) throws Exception {
         return cloudClient.uploadSongs(albumId, songs, songFiles);
    }
}
