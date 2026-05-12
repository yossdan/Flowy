package Model.controller.album_new.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Component
public class CloudAlbumClient {
    private final RestClient client;
    @Autowired
    public CloudAlbumClient(@Qualifier("cloudRestClient") RestClient client) {
        this.client = client;
    }

    public String uploadCoverImage(String albumTitle, MultipartFile file) {
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("titleAlbum", albumTitle);
        body.add("file", file.getResource());

        return client.post()
                .uri("/album/files/upload/coverPhoto")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .body(String.class);
    }

    public Map<String, byte[]> getCoverPhotos(List<String> coverImageObjectKeys) {
        return client.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/album/files/download/coverPhotos")
                        .queryParam("coverImageObjectKeys", coverImageObjectKeys)
                        .build())
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, byte[]>>() {});
    }
}
