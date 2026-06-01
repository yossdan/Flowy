package Model.controller.song_genre_new.dto.request;

import java.util.UUID;

public class GenreIdRequestDto {

        private UUID genreId;

        public GenreIdRequestDto() {
        }

        public GenreIdRequestDto(UUID genreId) {
                this.genreId = genreId;
        }

        public UUID getGenreId() {
                return genreId;
        }

        public void setGenreId(UUID genreId) {
                this.genreId = genreId;
        }

        @Override
        public String toString() {
                return "GenreIdRequestDto{" +
                                "genreId=" + genreId +
                                '}';
        }
}