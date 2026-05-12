import App.App;

import Model.controller.album_detail_new.dto.request.SongRequestDto;
import Model.controller.album_detail_new.service.AlbumDetailService;
import Model.controller.album_new.dto.request.CreateAlbumRequestDto;
import Model.controller.album_new.service.AlbumService;
import Model.controller.song_artist_new.dto.request.ArtistIdRequestDto;
import Model.controller.song_genre_new.dto.request.GenreIdRequestDto;

import org.apache.commons.io.FilenameUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@SpringBootTest(classes = App.class)
public class AlbumUpload {

    @Autowired
    AlbumService albumService;
    @Autowired
    AlbumDetailService albumDetailService;



    @Test
    void createAlbum() throws Exception {
        UUID userId = UUID.fromString("33078e41-3dc2-4503-b1a4-73bcacbc42d3"); //COLOCAR EL ID DE LA CUENTA DEL USUARIO
        String title = "Yellow Submarine"; //COLOCAR EL TITULO DEL ALBUM

        Path albumDirectory = Paths.get("D:\\MusicaParaSpotify\\The Beatles\\Yellow Submarine"); //COLOCAR LA UBICACIÓN DEL ALBUM

        CreateAlbumRequestDto albumInformation = getAlbumInformation(userId, title, albumDirectory);
        MockMultipartFile coverImageFile = getCoverImageFile(albumDirectory);
        List<MultipartFile> songs = getSongs(albumDirectory);

        albumService.createAlbum(albumInformation, coverImageFile, songs);
    }


    private Map<String, List<ArtistIdRequestDto>> getCollaboratingArtist(Path albumDirectory) throws IOException {
        Stream<Path> paths = Files.list(albumDirectory);
        String fileUrl = paths.filter(path -> Files.isRegularFile(path) && path.getFileName().toString().endsWith(".xlsm")).map(path -> path.toAbsolutePath().toString()).findFirst().orElse(null);

        return mapCollaboratingArtist(readSongsByArtistId(fileUrl));
    }

    private Map<String, List<GenreIdRequestDto>> getGenres(Path albumDirectory) throws IOException {
        Stream<Path> paths = Files.list(albumDirectory);
        String fileUrl = paths.filter(path -> Files.isRegularFile(path) && path.getFileName().toString().endsWith(".xlsm")).map(path -> path.toAbsolutePath().toString()).findFirst().orElse(null);

        return mapGenres(readSongsByGeneroId(fileUrl));
    }

    private CreateAlbumRequestDto getAlbumInformation(UUID userId,String title,Path albumDirectory) throws IOException {
        List<SongRequestDto> musicInformation = getMusicInformation(albumDirectory);
        return new CreateAlbumRequestDto(userId, title, musicInformation);
    }
    private List<SongRequestDto> getMusicInformation(Path albumDirectory) throws IOException {
        Map<String, List<ArtistIdRequestDto>> collaboratingArtist = getCollaboratingArtist(albumDirectory);
        Map<String, List<GenreIdRequestDto>> musicGenres = getGenres(albumDirectory);

        Stream<Path> paths = Files.list(albumDirectory);

        return paths.filter(path -> Files.isRegularFile(path) && path.getFileName().toString().endsWith(".mp3"))
                .sorted(Comparator.comparing(path -> FilenameUtils.getBaseName(path.toString())))
                .map(path -> {
                    String title = FilenameUtils.getBaseName(path.toString());
                    List<GenreIdRequestDto> genres = musicGenres.get(title);
                    return (collaboratingArtist.containsKey(title))?
                            new SongRequestDto(title, collaboratingArtist.get(title), genres)
                            : new SongRequestDto(title, genres);
                }).toList();
    }

    private List<MultipartFile> getSongs(Path albumDirectory) throws IOException {
        Stream<Path> paths = Files.list(albumDirectory);

        return paths.filter(path -> Files.isRegularFile(path) && path.getFileName().toString().endsWith(".mp3"))
                .sorted(Comparator.comparing(path -> FilenameUtils.getBaseName(path.toString())))
                .map(path -> {
                    try {
                        return (MultipartFile) new MockMultipartFile(
                                "file",
                                path.getFileName().toString(),
                                "audio/mpeg",
                                Files.readAllBytes(path)
                        );
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                })
                .toList();
    }

    private MockMultipartFile getCoverImageFile(Path albumDirectory) throws IOException {
        Stream<Path> paths = Files.list(albumDirectory);
        return paths
        .filter(path -> Files.isRegularFile(path) && path.getFileName().toString().endsWith(".webp"))
        .map(path -> {
            try {
                return new MockMultipartFile(
                        "file",
                        "coverImage.webp",
                        "image/webp",
                        Files.readAllBytes(path)
                );
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        })
        .findFirst()
        .orElse(null);
    }

    private Map<String, List<ArtistIdRequestDto>> mapCollaboratingArtist(Map<String, List<String>> collaboratingArtist){
        return collaboratingArtist.entrySet().stream()
                .collect(Collectors.toMap(
                        entry -> entry.getKey().replace(".mp3", ""),
                        entry -> entry.getValue().stream().map(id -> new ArtistIdRequestDto(UUID.fromString(id))).toList(),
                        (key1, key2) -> key1,
                        HashMap::new
                ));
    }
    private Map<String, List<GenreIdRequestDto>> mapGenres(Map<String, List<String>> genres){
        return genres.entrySet().stream()
                .collect(Collectors.toMap(
                        entry -> entry.getKey().replace(".mp3", ""),
                        entry -> entry.getValue().stream().map(id -> new GenreIdRequestDto(UUID.fromString(id))).toList(),
                        (key1, key2) -> key1,
                        HashMap::new
                ));
    }


    public Map<String, List<String>> readSongsByArtistId(String fileUrl) {
        Map<String, List<String>> resultMap = new LinkedHashMap<>();

        try (
                InputStream inputStream = new FileInputStream(fileUrl);
                XSSFWorkbook workbook = new XSSFWorkbook(inputStream)
        ) {
            DataFormatter formatter = new DataFormatter();

            XSSFSheet sheet = workbook.getSheet("Artistas");
            if (sheet == null) {
                throw new IllegalArgumentException("No existe la hoja 'Artista'");
            }

            int firstRow = 3; // fila 4 base 1
            int songColumn = 1; // columna B
            int artistIdColumn = 2; // columna C
            int lastRow = -1;

            // Buscar la última fila válida tomando como referencia la columna B
            for (int i = sheet.getLastRowNum(); i >= firstRow; i--) {
                Row row = sheet.getRow(i);
                if (row != null) {
                    Cell songCell = row.getCell(songColumn);
                    String songName = songCell == null ? "" : formatter.formatCellValue(songCell).trim();

                    if (!songName.isBlank()) {
                        lastRow = i;
                        break;
                    }
                }
            }

            if (lastRow == -1) {
                return resultMap;
            }

            // Leer registros desde fila 4 hasta la última encontrada
            for (int i = firstRow; i <= lastRow; i++) {
                Row row = sheet.getRow(i);

                if (row == null) {
                    continue;
                }

                Cell songCell = row.getCell(songColumn);
                Cell artistIdCell = row.getCell(artistIdColumn);

                String songName = songCell == null ? "" : formatter.formatCellValue(songCell).trim();
                String artistId = artistIdCell == null ? "" : formatter.formatCellValue(artistIdCell).trim();

                if (songName.isBlank()) {
                    continue;
                }

                if (resultMap.containsKey(songName)) {
                    resultMap.get(songName).add(artistId);
                } else {
                    List<String> artistIds = new ArrayList<>();
                    artistIds.add(artistId);
                    resultMap.put(songName, artistIds);
                }
            }

            return resultMap;

        } catch (Exception e) {
            throw new RuntimeException("Error al leer el archivo Excel desde la URL: " + fileUrl, e);
        }
    }
    public Map<String, List<String>> readSongsByGeneroId(String fileUrl) {
        Map<String, List<String>> resultMap = new LinkedHashMap<>();
        try (
                InputStream inputStream = new FileInputStream(fileUrl);
                XSSFWorkbook workbook = new XSSFWorkbook(inputStream)
        ) {
            DataFormatter formatter = new DataFormatter();

            XSSFSheet sheet = workbook.getSheet("Generos");
            if (sheet == null) {
                throw new IllegalArgumentException("No existe la hoja 'Generos'");
            }

            int firstRow = 3; // fila 4 base 1
            int songColumn = 1; // columna B
            int generoIdColumn = 2; // columna C
            int lastRow = -1;

            // Buscar última fila válida usando columna B
            for (int i = sheet.getLastRowNum(); i >= firstRow; i--) {
                Row row = sheet.getRow(i);
                if (row != null) {
                    Cell songCell = row.getCell(songColumn);
                    String songName = songCell == null ? "" : formatter.formatCellValue(songCell).trim();

                    if (!songName.isBlank()) {
                        lastRow = i;
                        break;
                    }
                }
            }

            if (lastRow == -1) {
                return resultMap;
            }

            // Leer todos los registros
            for (int i = firstRow; i <= lastRow; i++) {
                Row row = sheet.getRow(i);

                if (row == null) {
                    continue;
                }

                Cell songCell = row.getCell(songColumn);
                Cell generoIdCell = row.getCell(generoIdColumn);

                String songName = songCell == null ? "" : formatter.formatCellValue(songCell).trim();
                String generoId = generoIdCell == null ? "" : formatter.formatCellValue(generoIdCell).trim();

                if (songName.isBlank()) {
                    continue;
                }

                if (resultMap.containsKey(songName)) {
                    resultMap.get(songName).add(generoId);
                } else {
                    List<String> generoIds = new ArrayList<>();
                    generoIds.add(generoId);
                    resultMap.put(songName, generoIds);
                }
            }

            return resultMap;

        } catch (Exception e) {
            throw new RuntimeException("Error al leer el archivo Excel desde la URL: " + fileUrl, e);
        }
    }
}
