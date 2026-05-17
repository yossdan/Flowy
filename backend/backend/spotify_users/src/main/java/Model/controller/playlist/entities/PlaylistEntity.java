package Model.controller.playlist.entities;


import Model.controller.user.entities.UserEntity;
import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "playlist",
uniqueConstraints = {@UniqueConstraint(name = "playlist_title_userId_UK", columnNames = {"title", "user_id"})})
public class PlaylistEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "title", nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity userId;

    @Column(name = "cover_image_object_key", nullable = false)
    private String coverImageObjectKey;

    @OneToMany(fetch = FetchType.LAZY)
    private List<PlayListDetailEntity> playlistDetail;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;


    public PlaylistEntity() {
    }

    public PlaylistEntity(UUID id, String title, UserEntity userId, String coverImageObjectKey, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.userId = userId;
        this.coverImageObjectKey = coverImageObjectKey;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public UserEntity getUserId() {
        return userId;
    }

    public void setUserId(UserEntity userId) {
        this.userId = userId;
    }

    public String getCoverImageObjectKey() {
        return coverImageObjectKey;
    }

    public void setCoverImageObjectKey(String coverImageObjectKey) {
        this.coverImageObjectKey = coverImageObjectKey;
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
        return "PlayListEntity{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", userId=" + userId +
                ", cover_image_object_key='" + coverImageObjectKey + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
