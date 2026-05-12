package Model.controller.users;

import Model.controller.users.dto.request.UserProfilePhotoRequestDto;
import Model.controller.users.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/upload/profilePhoto/{userId}")
    public ResponseEntity<?> uploadProfilePhoto(@PathVariable UUID userId,
                                                @RequestPart MultipartFile file) {
        try {
            String profilePhotoObjectKey = userService.uploadProfilePhoto(userId, file);

            return ResponseEntity.ok(profilePhotoObjectKey);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", "Error al subir el archivo",
                    "details", e.getMessage()
            ));
        }
    }

    @GetMapping("/download/profilePhoto/{profilePhotoObjectKey}")
    public ResponseEntity<byte[]> getProfilePhoto(@PathVariable String profilePhotoObjectKey) {
        try {
            byte[] file = userService.getProfilePhoto(profilePhotoObjectKey);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + profilePhotoObjectKey + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(file);

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }





    @DeleteMapping("/delete/profilePhoto/{profilePhotoObjectKey}")
    public ResponseEntity<Void> deleteProfilePhoto(@PathVariable String profilePhotoObjectKey) {
        userService.deleteProfilePhoto(profilePhotoObjectKey);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/update/profilePhoto/{profilePhotoObjectKey}")
    public ResponseEntity<Void> updateProfilePhoto(@PathVariable String profilePhotoObjectKey, @RequestPart MultipartFile file) {
        userService.updateProfilePhoto(profilePhotoObjectKey, file);
        return ResponseEntity.noContent().build();
    }
}