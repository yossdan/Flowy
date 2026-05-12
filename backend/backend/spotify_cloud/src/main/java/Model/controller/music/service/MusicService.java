package Model.controller.music.service;

import Model.config.CloudflareR2Properties;
import Model.controller.music.dto.request.SongRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MusicService {

    private final S3Client s3Client;
    private final CloudflareR2Properties properties;

    @Autowired
    public MusicService(S3Client s3Client, CloudflareR2Properties properties) {
        this.s3Client = s3Client;
        this.properties = properties;
    }


    public Map<String, String> uploadSongs(UUID albumId, List<SongRequestDto> songs, List<MultipartFile> songFiles)  {
        Map <String, String> objectKeys = new HashMap();
        for(int i = 0; i < songs.size(); i++) {
            String objectKey = uploadSong(albumId, songs.get(i), songFiles.get(i));
            objectKeys.put(songs.get(i).getTitle(), objectKey);
        }
        return objectKeys;
    }

    private String uploadSong(UUID albumId, SongRequestDto song, MultipartFile songFile) {
        String coverImageObjectKey = String.valueOf(albumId) + "-"  + song.getTitle() + "-song";
        try {
            Path tempFile = Files.createTempFile("upload-", coverImageObjectKey);
            songFile.transferTo(tempFile.toFile());

            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(properties.getBucket())
                    .key(coverImageObjectKey)
                    .contentType(songFile.getContentType())
                    .build();

            s3Client.putObject(request, RequestBody.fromFile(tempFile));

            Files.deleteIfExists(tempFile);
        } catch (IOException e) {
            throw new RuntimeException("Lo sentimos, ocurrió un error inesperado al cargar tu archivo. Por favor, verifica tu conexión a internet e inténtalo de nuevo.");
        }


        return coverImageObjectKey;
    }

    public byte[] getCoverPhoto(String coverImageObjectKey) {
        GetObjectRequest request = GetObjectRequest.builder()
                .bucket(properties.getBucket())
                .key(coverImageObjectKey)
                .build();

        ResponseBytes<GetObjectResponse> objectBytes = s3Client.getObjectAsBytes(request);
        return objectBytes.asByteArray();
    }
    public byte[] getSong(String songObjectKey) {
        GetObjectRequest request = GetObjectRequest.builder()
                .bucket(properties.getBucket())
                .key(songObjectKey)
                .build();

        ResponseBytes<GetObjectResponse> objectBytes = s3Client.getObjectAsBytes(request);
        return objectBytes.asByteArray();
    }


    public Map<String, byte[]> getCoverPhotos(List<String> coverImageObjectKeys){
        return coverImageObjectKeys.stream()
                .map(key -> {
                    try {
                        return Map.entry(key, getCoverPhoto(key));
                    } catch (Exception e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

}
