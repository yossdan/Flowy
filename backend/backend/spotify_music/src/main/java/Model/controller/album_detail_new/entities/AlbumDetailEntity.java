package Model.controller.album_detail_new.entities;


import Model.controller.album_new.entities.AlbumEntity;
import Model.controller.song_artist_new.entities.SongArtistEntity;
import Model.controller.song_genre_new.entities.SongGenreEntity;
import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "album_detail")
public class AlbumDetailEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id")
    private AlbumEntity albumId;

    @Column(name = "title")
    private String title;

    @Column(name = "audio_object_key")
    private String audioObjectKey;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;




    @OneToMany(fetch = FetchType.LAZY, mappedBy = "songId")
    private List<SongArtistEntity> songArtistEntities;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "songId")
    private List<SongGenreEntity> songGenreEntities;

    public AlbumDetailEntity() {
    }

    public AlbumDetailEntity(UUID id, AlbumEntity albumId, String title, String audioObjectKey, List<SongArtistEntity> songArtistEntities, List<SongGenreEntity> songGenreEntities, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.albumId = albumId;
        this.title = title;
        this.audioObjectKey = audioObjectKey;
        this.songArtistEntities = songArtistEntities;
        this.songGenreEntities = songGenreEntities;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public AlbumDetailEntity(AlbumEntity albumId, String title, String audioObjectKey) {
        this.albumId = albumId;
        this.title = title;
        this.audioObjectKey = audioObjectKey;
        this.createdAt = OffsetDateTime.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public AlbumEntity getAlbumId() {
        return albumId;
    }

    public void setAlbumId(AlbumEntity albumId) {
        this.albumId = albumId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAudioObjectKey() {
        return audioObjectKey;
    }

    public void setAudioObjectKey(String audioObjectKey) {
        this.audioObjectKey = audioObjectKey;
    }

    public List<SongArtistEntity> getSongArtistEntities() {
        return songArtistEntities;
    }

    public void setSongArtistEntities(List<SongArtistEntity> songArtistEntities) {
        this.songArtistEntities = songArtistEntities;
    }

    public List<SongGenreEntity> getSongGenreEntities() {
        return songGenreEntities;
    }

    public void setSongGenreEntities(List<SongGenreEntity> songGenreEntities) {
        this.songGenreEntities = songGenreEntities;
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
        return "AlbumDetailEntity{" +
                "id=" + id +
                ", albumId=" + albumId +
                ", title='" + title + '\'' +
                ", audioObjectKey='" + audioObjectKey + '\'' +
                ", songArtistEntities=" + songArtistEntities +
                ", songGenreEntities=" + songGenreEntities +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
