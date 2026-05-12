package Model.controller.song_genre_new.entities;


import Model.controller.album_detail_new.entities.AlbumDetailEntity;
import Model.controller.music_genre_new.entities.MusicGenreEntity;
import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "song_genre",
    uniqueConstraints = @UniqueConstraint(
            name = "song_genre_songId_musicGenreId_uk",
            columnNames = {"song_id", "music_genre_id"}
    )
)
public class SongGenreEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "song_id")
    private AlbumDetailEntity songId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "music_genre_id")
    private MusicGenreEntity musicGenreId;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    public SongGenreEntity() {
    }

    public SongGenreEntity(AlbumDetailEntity songId, MusicGenreEntity musicGenreId) {
        this.songId = songId;
        this.musicGenreId = musicGenreId;
        this.createdAt = OffsetDateTime.now();
    }

    public SongGenreEntity(UUID id, AlbumDetailEntity songId, MusicGenreEntity musicGenreId, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.songId = songId;
        this.musicGenreId = musicGenreId;
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

    public MusicGenreEntity getMusicGenreId() {
        return musicGenreId;
    }

    public void setMusicGenreId(MusicGenreEntity musicGenreId) {
        this.musicGenreId = musicGenreId;
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
        return "SongGenreEntity{" +
                "id=" + id +
                ", songId=" + songId +
                ", musicGenreId=" + musicGenreId +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
