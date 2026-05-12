package Model.controller.music_genre_new.dto.response;

import java.util.UUID;

public record GenreResponseDto(
        UUID id,
        String name
) {
    @Override
    public String toString() {
        return "GenreResponseDto{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
