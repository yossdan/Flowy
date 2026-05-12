package Model.controller.user.clients;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Component
public class CloudUserClient {
    private final RestClient client;
    @Autowired
    public CloudUserClient (@Qualifier("cloudRestClient") RestClient client) {
        this.client = client;
    }
    public byte[] getProfilePhoto(String profilePhotoObjectKey){
        return client.get()
                .uri("/user/download/profilePhoto/{profilePhotoObjectKey}", profilePhotoObjectKey)
                .retrieve()
                .body(byte[].class);
    }
    public void deleteProfilePhoto(String profilePhotoObjectKey){
        client.delete()
                .uri("user/delete/profilePhoto/{profilePhotoObjectKey}",profilePhotoObjectKey)
                .retrieve()
                .toBodilessEntity();
    }
    public String uploadProfilePhoto(UUID userId, MultipartFile file){
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", file.getResource());

        return client.post()
                .uri("user/upload/profilePhoto/{userId}",userId)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .body(String.class);
    }
    public void updateProfilePhoto(String profilePhotoObjectKey ,MultipartFile file){
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", file.getResource());

        client.patch()
                .uri("user/update/profilePhoto/{profilePhotoObjectKey}",profilePhotoObjectKey)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }
}
