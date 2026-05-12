package Model.controller.playlist.service;

import Model.controller.playlist.entities.PlaylistEntity;
import Model.controller.playlist.repository.PlayListDetailRepository;
import Model.controller.playlist.repository.PlaylistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PlaylistService {
    private PlayListDetailRepository playListDetailRepository;
    private PlaylistRepository playListRepository;

    private PlaylistCloudServices playlistCloudServices;
    @Autowired
    public PlaylistService(PlaylistRepository playListRepository,PlayListDetailRepository playListDetailRepository, PlaylistCloudServices playlistCloudServices) {
        this.playListRepository = playListRepository;
        this.playListDetailRepository = playListDetailRepository;
        this.playlistCloudServices = playlistCloudServices;
    }
    public void deletePlaylist(UUID userId){
        List<PlaylistEntity> playlistEntities = playListRepository.findByUserId_Id(userId);
        if(!playlistEntities.isEmpty()){
            List<String> coverImageObjectKeys = playlistEntities.stream()
                    .map(PlaylistEntity::getCoverImageObjectKey)
                    .toList();
            playlistCloudServices.deletePlaylist(coverImageObjectKeys);
        }
    }
}
