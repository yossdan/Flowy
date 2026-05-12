package Model.controller.playlist.service;

import Model.config.CloudflareR2Properties;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;

import java.util.List;

@Service
public class PlaylistService {
    private final S3Client s3Client;
    private final CloudflareR2Properties properties;

    public PlaylistService(S3Client s3Client, CloudflareR2Properties properties) {
        this.s3Client = s3Client;
        this.properties = properties;
    }

    public void deletePlaylistPhotos(List<String> coverImageObjectKeys){
        for(String coverImageObjectKey : coverImageObjectKeys){
            DeleteObjectRequest request = DeleteObjectRequest.builder()
                    .bucket(properties.getBucket())
                    .key(coverImageObjectKey)
                    .build();

            s3Client.deleteObject(request);
        }
    }
}
