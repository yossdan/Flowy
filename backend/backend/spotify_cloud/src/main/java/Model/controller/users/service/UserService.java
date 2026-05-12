package Model.controller.users.service;

import Model.config.CloudflareR2Properties;
import Model.controller.users.dto.request.UserProfilePhotoRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final S3Client s3Client;
    private final CloudflareR2Properties properties;

    @Autowired
    public UserService(S3Client s3Client, CloudflareR2Properties properties) {
        this.s3Client = s3Client;
        this.properties = properties;
    }
    public String uploadProfilePhoto(UUID userId,MultipartFile file)  {
        String profilePhotoObjectKey = getProfilePhotoObjectKey(userId);
        try {
            Path tempFile = Files.createTempFile("upload-", profilePhotoObjectKey);
            file.transferTo(tempFile.toFile());

            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(properties.getBucket())
                    .key(profilePhotoObjectKey)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(request, RequestBody.fromFile(tempFile));

            Files.deleteIfExists(tempFile);
        } catch (IOException e) {
            throw new RuntimeException("Lo sentimos, ocurrió un error inesperado al cargar tu archivo. Por favor, verifica tu conexión a internet e inténtalo de nuevo.");
        }


        return profilePhotoObjectKey;
    }

    public byte[] getProfilePhoto(String profilePhotoObjectKey) {
        GetObjectRequest request = GetObjectRequest.builder()
                .bucket(properties.getBucket())
                .key(profilePhotoObjectKey)
                .build();

        ResponseBytes<GetObjectResponse> objectBytes = s3Client.getObjectAsBytes(request);
        return objectBytes.asByteArray();
    }

    public void deleteProfilePhoto(String profilePhotoObjectKey) {
        DeleteObjectRequest request = DeleteObjectRequest.builder()
                .bucket(properties.getBucket())
                .key(profilePhotoObjectKey)
                .build();

        s3Client.deleteObject(request);
    }

    public void updateProfilePhoto(String profilePhotoObjectKey ,MultipartFile file){
        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(properties.getBucket())
                    .key(profilePhotoObjectKey)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(
                    request,
                    RequestBody.fromBytes(file.getBytes())
            );
        } catch (IOException e) {
            throw new RuntimeException("No pudimos guardar los cambios en tu imagen de perfil. Por favor, inténtalo de nuevo en unos momentos.");
        }
    }

    public boolean existsByProfilePhotoObjectKey(String profilePhotoObjectKey) {
        try {
            s3Client.headObject(
                    HeadObjectRequest.builder()
                            .bucket(properties.getBucket())
                            .key(profilePhotoObjectKey)
                            .build()
            );
            return true;

        } catch (S3Exception e) {
            if (e.statusCode() == 404) {
                return false;
            }

            if (e.statusCode() == 403) {
                throw new RuntimeException("No se pudo verificar si existe el archivo: permisos insuficientes.", e);
            }

            throw new RuntimeException("Error al verificar archivo en R2: " + e.getMessage(), e);
        }
    }

    private String getProfilePhotoObjectKey(UUID userId){
        return String.valueOf(userId) + "-profile_photo";
    }




}
