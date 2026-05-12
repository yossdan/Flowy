package Model.controller.album_new.entities;

import Model.controller.album_detail_new.entities.AlbumDetailEntity;
import Model.controller.artist_new.entities.ArtistEntity;
import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "album")
public class AlbumEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "title")
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_id")
    private ArtistEntity artistId;

    @OneToMany(mappedBy = "albumId", fetch = FetchType.LAZY)
    private List<AlbumDetailEntity> albums;


    @Column(name = "cover_image_object_key")
    private String coverImageObjectKey;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    public AlbumEntity() {
    }

    public AlbumEntity(UUID id, String title, ArtistEntity artistId, String coverImageObjectKey, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.artistId = artistId;
        this.coverImageObjectKey = coverImageObjectKey;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public AlbumEntity(String title, ArtistEntity artistId, String coverImageObjectKey) {
        this.title = title;
        this.artistId = artistId;
        this.coverImageObjectKey = coverImageObjectKey;
        this.createdAt =  OffsetDateTime.now();
    }

    public AlbumEntity(UUID id) {
        this.id = id;
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

    public ArtistEntity getArtistId() {
        return artistId;
    }

    public void setArtistId(ArtistEntity artistId) {
        this.artistId = artistId;
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
        return "AlbumEntity{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", artistId=" + artistId +
                ", coverImageObjectKey='" + coverImageObjectKey + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
