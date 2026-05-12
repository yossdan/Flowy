package Model.controller.album_detail_new.client;


import Model.controller.album_detail_new.dto.request.SongRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudAlbumDetailClient {
    private RestClient client;
    @Autowired
    public CloudAlbumDetailClient(@Qualifier("cloudRestClient") RestClient client) {
        this.client = client;
    }
    public Map<String, String> uploadSongs(UUID albumId,
                                           List<SongRequestDto> songs,
                                           List<MultipartFile> songFiles) throws Exception {

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        ObjectMapper mapper = new ObjectMapper();

        HttpHeaders jsonHeaders = new HttpHeaders();
        jsonHeaders.setContentType(MediaType.APPLICATION_JSON);
        body.add("songs", new HttpEntity<>(mapper.writeValueAsString(songs), jsonHeaders));

        for (MultipartFile file : songFiles) {
            ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };

            HttpHeaders fileHeaders = new HttpHeaders();
            fileHeaders.setContentType(MediaType.parseMediaType(
                    file.getContentType() != null ? file.getContentType() : "application/octet-stream"
            ));

            body.add("songFiles", new HttpEntity<>(resource, fileHeaders));
        }

        return client.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/music/upload/songs")
                        .queryParam("albumId", albumId)
                        .build())
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, String>>() {});
    }

    public Map<String, byte[]> getAlbumPhotosFromCloud (List<String> coverImageObjectKeys) {
        return client.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/music/download/coverPhotos")
                        .queryParam("coverImageObjectKeys", coverImageObjectKeys)
                        .build())
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, byte[]>>() {});
    }
    public byte[] getSong(String songObjectKeys) {
        return client.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/music/download/song")
                        .queryParam("songObjectKeys", songObjectKeys)
                        .build())
                .retrieve()
                .body(byte[].class);
    }
}
