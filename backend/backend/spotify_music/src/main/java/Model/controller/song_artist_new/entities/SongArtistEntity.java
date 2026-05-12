package Model.controller.song_artist_new.entities;


import Model.controller.album_detail_new.entities.AlbumDetailEntity;
import Model.controller.artist_new.entities.ArtistEntity;
import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "song_artist",
    uniqueConstraints = @UniqueConstraint(
            name = "song_artist_songId_artistId_uk",
            columnNames = {"song_id", "artist_id"}
    )
)

public class SongArtistEntity {
    @Id
    @GeneratedValue (strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "song_id")
    private AlbumDetailEntity songId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_id")
    private ArtistEntity artistId;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    public SongArtistEntity() {
    }

    public SongArtistEntity(AlbumDetailEntity songId, ArtistEntity artistId) {
        this.songId = songId;
        this.artistId = artistId;
        this.createdAt = OffsetDateTime.now();
    }

    public SongArtistEntity(UUID id, AlbumDetailEntity songId, ArtistEntity artistId, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.songId = songId;
        this.artistId = artistId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public AlbumDetailEntity getSongId() {
        return songId;
    }

    public void setSongId(AlbumDetailEntity songId) {
        this.songId = songId;
    }

    public ArtistEntity getArtistId() {
        return artistId;
    }

    public void setArtistId(ArtistEntity artistId) {
        this.artistId = artistId;
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
}
