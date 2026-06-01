package Model.controller.album_detail_new.dto.request;

import Model.controller.song_artist_new.dto.request.ArtistIdRequestDto;
import Model.controller.song_genre_new.dto.request.GenreIdRequestDto;

import java.util.ArrayList;
import java.util.List;

public class SongRequestDto {
    private String title;
    private List<ArtistIdRequestDto> artistIds;
    private List<GenreIdRequestDto> genreIds;

    public SongRequestDto() {
        this.artistIds = new ArrayList<>();
        this.genreIds = new ArrayList<>();
    }

    public SongRequestDto(String title) {
        this.title = title;
        this.artistIds = new ArrayList<>();
        this.genreIds = new ArrayList<>();
    }

    public SongRequestDto(String title, List<GenreIdRequestDto> genreIds) {
        this.title = title;
        this.genreIds = genreIds;
        this.artistIds = new ArrayList<>();
    }

    public SongRequestDto(String title, List<ArtistIdRequestDto> artistIds, List<GenreIdRequestDto> genreIds) {
        this.title = title;
        this.artistIds = artistIds;
        this.genreIds = genreIds;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<ArtistIdRequestDto> getArtistIds() {
        return artistIds;
    }

    public void setArtistIds(List<ArtistIdRequestDto> artistIds) {
        this.artistIds = artistIds;
    }

    public List<GenreIdRequestDto> getGenreIds() {
        return genreIds;
    }

    public void setGenreIds(List<GenreIdRequestDto> genreIds) {
        this.genreIds = genreIds;
    }

    @Override
    public String toString() {
        return "SongRequestDto{" +
                "title='" + title + '\'' +
                ", artistIds=" + artistIds +
                ", genreIds=" + genreIds +
                '}';
    }
}