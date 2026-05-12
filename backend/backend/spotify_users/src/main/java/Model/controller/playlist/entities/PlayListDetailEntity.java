package Model.controller.playlist.entities;


import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "playlist_detail")
public class PlayListDetailEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "playlist_id")
    private PlaylistEntity playlistId;

    @Column(name = "song_id")
    private UUID songId;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    public PlayListDetailEntity() {

    }

    public PlayListDetailEntity(UUID id, PlaylistEntity playlistId, UUID songId, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.playlistId = playlistId;
        this.songId = songId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public PlaylistEntity getPlaylistId() {
        return playlistId;
    }

    public void setPlaylistId(PlaylistEntity playlistId) {
        this.playlistId = playlistId;
    }

    public UUID getSongId() {
        return songId;
    }

    public void setSongId(UUID songId) {
        this.songId = songId;
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
        return "PlaylistDetailEntity{" +
                "id=" + id +
                ", playlistId=" + playlistId +
                ", songId=" + songId +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
