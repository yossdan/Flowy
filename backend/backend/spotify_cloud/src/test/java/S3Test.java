import App.App;
import Model.controller.users.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.UUID;

@SpringBootTest(classes = App.class)
public class S3Test {

    @Autowired
    private UserService userService;


    @Test
    void uploadProfilePhoto() throws IOException {

        UUID userId = UUID.randomUUID();
        Path path = Paths.get("C:\\Users\\migue\\Downloads\\profile_photo.jpg");
        byte[] imageBytes2 = Files.readAllBytes(path);
        MockMultipartFile imageFile = new MockMultipartFile(
                "profile_photo",
                "image.png",
                MediaType.IMAGE_PNG_VALUE,
                imageBytes2
        );
        userService.uploadProfilePhoto(userId, imageFile);
    }
    @Test
    void getProfilePhoto(){
        String profilePhotoObjectKey = "8123bf5d-de7a-4880-afd1-51b63fee50c0-profile_photo";
        byte[]  profilePhoto = userService.getProfilePhoto(profilePhotoObjectKey);
        System.out.println(Arrays.toString(profilePhoto));
    }

    @Test
    void deleteProfilePhoto(){
        String profilePhotoObjectKey = "8123bf5d-de7a-4880-afd1-51b63fee50c0-profile_photo";
        userService.deleteProfilePhoto(profilePhotoObjectKey);
    }
    @Test
    void updateProfilePhoto() throws IOException {
        String profilePhotoObjectKey = "2c9d9390-3e75-4031-a39b-cf68e1e8fda7-profile_photo";
        Path path = Paths.get("C:\\Users\\migue\\Downloads\\profile_photo2.jpg");
        byte[] imageBytes2 = Files.readAllBytes(path);
        MockMultipartFile imageFile = new MockMultipartFile(
                "profile_photo",
                "image.png",
                MediaType.IMAGE_PNG_VALUE,
                imageBytes2
        );
        userService.updateProfilePhoto(profilePhotoObjectKey, imageFile);
    }

}
