package Model.controller.artist_new.utils;


import Model.controller.artist_new.clients.CloudArtistClient;
import Model.controller.artist_new.clients.UserArtistClient;
import Model.controller.artist_new.dto.request.UserProfilePhotoRequestDto;
import Model.controller.artist_new.dto.response.UserProfilePhotoResponseDto;
import Model.controller.artist_new.entities.ArtistEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ArtistPhotoCloudService {

    private final CloudArtistClient cloudClient;
    private final UserArtistClient userClient;

    @Autowired
    public ArtistPhotoCloudService(CloudArtistClient cloudClient, UserArtistClient userClient) {
        this.cloudClient = cloudClient;
        this.userClient = userClient;
    }
    public Map<UUID, byte[]> getProfilePhotos(List<ArtistEntity> artists){
        List<UUID> userIds = artists.stream().map(ArtistEntity::getUserId).toList();
        List<UserProfilePhotoResponseDto> userProfilePhotoResponseDtos = userClient.findProfilePhotoKeysByUuids(userIds);

        List<UserProfilePhotoRequestDto> userProfilePhotoRequestDto = userProfilePhotoResponseDtos.stream()
                .map(dto -> new UserProfilePhotoRequestDto(dto.userId(), dto.profilePhotoObjectKey()))
                .toList();


        return cloudClient.getArtistProfilePhoto(userProfilePhotoRequestDto);
    }

}
