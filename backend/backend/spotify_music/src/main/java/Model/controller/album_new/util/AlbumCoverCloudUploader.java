package Model.controller.album_new.util;


import Model.controller.album_new.client.CloudAlbumClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AlbumCoverCloudUploader {
    private final CloudAlbumClient cloudClient;
    @Autowired
    public AlbumCoverCloudUploader(CloudAlbumClient cloudClient) {
        this.cloudClient = cloudClient;
    }

    public String uploadCoverPhoto(String albumTitle, MultipartFile coverFile){
        return cloudClient.uploadCoverImage(albumTitle,coverFile);
    }

}
