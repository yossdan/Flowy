package Model.controller.user.utils;

import Model.controller.user.clients.CloudUserClient;
import org.springframework.stereotype.Service;

@Service
public class UserContentCloudService {
    private final CloudUserClient cloudClient;
    public UserContentCloudService(CloudUserClient cloudClient) {
        this.cloudClient = cloudClient;
    }
    public byte [] getProfilePhoto(String profilePhotoObjectKey, String defaultProfilePhotoKey){
        byte [] profilePhoto = null;
        try {
            profilePhoto = cloudClient.getProfilePhoto(profilePhotoObjectKey);
        } catch (Exception e) {
            if(!profilePhotoObjectKey.equals(defaultProfilePhotoKey)){
                profilePhoto =cloudClient.getProfilePhoto(defaultProfilePhotoKey);
            }
        }
        return profilePhoto;
    }
}
