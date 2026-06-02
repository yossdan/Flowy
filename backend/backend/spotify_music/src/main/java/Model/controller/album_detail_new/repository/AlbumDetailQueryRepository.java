package Model.controller.album_detail_new.repository;

import Model.controller.album_detail_new.entities.AlbumDetailEntity;
import Model.controller.album_detail_new.exception.AlbumDetailException;
import Model.controller.album_new.entities.AlbumEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class AlbumDetailQueryRepository {
    private final AlbumDetailRepository repository;
    @Autowired
    public AlbumDetailQueryRepository(AlbumDetailRepository repository) {
        this.repository = repository;
    }
    public AlbumDetailEntity saveMusic(AlbumEntity albumEntity, String musicTitle, String audioObjectKey){
        return repository.save(new AlbumDetailEntity(albumEntity,musicTitle,audioObjectKey));
    }
    public List<AlbumDetailEntity> findMusicByKeyword(String keyword){
        return repository.findByTitleStartingWithIgnoreCase(keyword);
    }
    public AlbumDetailEntity findMusicById(UUID id){
        Optional<AlbumDetailEntity> optional = repository.findById(id);
        if(optional.isPresent()){
            return optional.get();
        }
        throw new AlbumDetailException("Existe una error al intentar encontrar la canción");
    }
    public List<AlbumDetailEntity> findTop2ByAlbum(AlbumEntity albumEntity){
        return repository.findTop2ByAlbumId(albumEntity);
    }
    public List<AlbumDetailEntity> findAllSongsByAlbum(AlbumEntity albumEntity){
        return repository.getAllByAlbumId(albumEntity);
    }
}
