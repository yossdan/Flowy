package Model.controller.user.clients;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class UserMusicClient {
    private final RestClient client;
    @Autowired
    public UserMusicClient (@Qualifier("musicRestClient") RestClient client) {
        this.client = client;
    }
}
