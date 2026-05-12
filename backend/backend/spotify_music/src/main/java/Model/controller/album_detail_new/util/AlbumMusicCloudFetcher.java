package Model.controller.album_detail_new.util;


import Model.controller.album_detail_new.client.CloudAlbumDetailClient;
import Model.controller.album_new.entities.AlbumEntity;
import Model.controller.album_new.repository.AlbumQueryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AlbumMusicCloudFetcher {
    private final CloudAlbumDetailClient cloudClient;
    @Autowired
    public AlbumMusicCloudFetcher(CloudAlbumDetailClient cloudClient, AlbumQueryRepository albumQueryRepository) {
        this.cloudClient = cloudClient;
    }
    public Map<String, byte[]> getAlbumPhotosFromCloud(List<AlbumEntity> albumEntities) {

        List<String> coverImageObjectKeys = albumEntities.stream().map(AlbumEntity::getCoverImageObjectKey).distinct().toList();

        return cloudClient.getAlbumPhotosFromCloud(coverImageObjectKeys);
    }

    public byte[] getSong(String songObjectKey){
        return cloudClient.getSong(songObjectKey);
    }
}
