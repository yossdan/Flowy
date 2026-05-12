package Model.controller.artist_new.entities;



import Model.controller.album_new.entities.AlbumEntity;
import Model.controller.song_artist_new.entities.SongArtistEntity;
import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "artist")
public class ArtistEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "name",  nullable = false, unique = true)
    private String name;

    @Column(name = "user_id",  nullable = false, unique = true)
    private UUID userId;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;


    @OneToMany(fetch = FetchType.LAZY, mappedBy = "artistId")
    private List<SongArtistEntity> songArtistEntities;

    @OneToMany(mappedBy = "artistId", fetch = FetchType.LAZY)
    private List<AlbumEntity> albums;

    public ArtistEntity() {
    }

    public ArtistEntity( UUID userId, String name) {
        this.name = name;
        this.userId = userId;
        this.createdAt = OffsetDateTime.now();
    }


    public ArtistEntity(UUID id) {
        this.id = id;
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

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
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
        return "Artist{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", userId=" + userId +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
