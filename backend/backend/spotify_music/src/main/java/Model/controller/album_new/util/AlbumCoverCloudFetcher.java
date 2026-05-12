package Model.controller.album_new.util;


import Model.controller.album_new.client.CloudAlbumClient;
import Model.controller.album_new.entities.AlbumEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AlbumCoverCloudFetcher {
    private final CloudAlbumClient cloudClient;
    @Autowired
    public AlbumCoverCloudFetcher(CloudAlbumClient cloudClient) {
        this.cloudClient = cloudClient;
    }
    public Map<String, byte[]> fetchAlbumCoversFromCloud(List<AlbumEntity> albumEntities){
        List<String> albumPhotoKeys = albumEntities.stream().map(AlbumEntity::getCoverImageObjectKey).toList();
        return cloudClient.getCoverPhotos(albumPhotoKeys);
    }
}
