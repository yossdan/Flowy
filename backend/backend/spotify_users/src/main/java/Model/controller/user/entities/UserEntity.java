package Model.controller.user.entities;


import Model.controller.playlist.entities.PlaylistEntity;

import Model.controller.role.entities.RoleEntity;
import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name ="name", nullable = false)
    private String name;

    @Column(name = "email",nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "profile_photo_object_key", nullable = false)
    private String profilePhotoObjectKey;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    private RoleEntity roleId;

    @OneToMany(mappedBy = "userId",fetch = FetchType.LAZY)
    List<PlaylistEntity> playListEntities;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    public UserEntity() {

    }

    public UserEntity(String name, String email, String password, String profilePhotoObjectKey, RoleEntity roleId) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.profilePhotoObjectKey = profilePhotoObjectKey;
        this.roleId = roleId;
        this.createdAt = OffsetDateTime.now();
    }

    public UserEntity(UUID id, String name, String email, String password, String profilePhotoObjectKey, RoleEntity roleId, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.profilePhotoObjectKey = profilePhotoObjectKey;
        this.roleId = roleId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getProfilePhotoObjectKey() {
        return profilePhotoObjectKey;
    }

    public void setProfilePhotoObjectKey(String profilePhotoObjectKey) {
        this.profilePhotoObjectKey = profilePhotoObjectKey;
    }

    public RoleEntity getRoleId() {
        return roleId;
    }

    public void setRoleId(RoleEntity roleId) {
        this.roleId = roleId;
    }

    public List<PlaylistEntity> getPlayListEntities() {
        return playListEntities;
    }

    public void setPlayListEntities(List<PlaylistEntity> playListEntities) {
        this.playListEntities = playListEntities;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "UserEntity{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", profilePhotoObjectKey='" + profilePhotoObjectKey + '\'' +
                ", roleId=" + roleId +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
