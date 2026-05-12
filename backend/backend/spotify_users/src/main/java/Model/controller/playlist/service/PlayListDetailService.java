package Model.controller.playlist.service;

import Model.controller.playlist.repository.PlayListDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PlayListDetailService {
    private PlayListDetailRepository playListDetailRepository;
    @Autowired
    public PlayListDetailService(PlayListDetailRepository playListDetailRepository) {
        this.playListDetailRepository = playListDetailRepository;
    }
}
