package Model.controller.artist.service;

import Model.config.CloudflareR2Properties;
import Model.controller.users.dto.request.UserProfilePhotoRequestDto;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ArtistService {

    private final S3Client s3Client;
    private final CloudflareR2Properties properties;

    public ArtistService(S3Client s3Client, CloudflareR2Properties properties) {
        this.s3Client = s3Client;
        this.properties = properties;
    }

    public byte[] getProfilePhoto(String profilePhotoObjectKey) {
        GetObjectRequest request = GetObjectRequest.builder()
                .bucket(properties.getBucket())
                .key(profilePhotoObjectKey)
                .build();

        ResponseBytes<GetObjectResponse> objectBytes = s3Client.getObjectAsBytes(request);
        return objectBytes.asByteArray();
    }

    public Map<UUID, byte[]> getArtistProfilePhoto(List<UserProfilePhotoRequestDto> userProfilePhotoRequestDto) {
        return userProfilePhotoRequestDto.stream()
                .collect(Collectors.toMap(
                        UserProfilePhotoRequestDto::userId,
                        user -> getProfilePhoto(user.profilePhotoObjectKey()),
                        (u1, u2) -> u1,
                        HashMap::new));
    }

}
