import App.App;

import Model.controller.user.dto.request.LoginUserRequestDto;
import Model.controller.user.dto.request.RegisterUserRequestDto;
import Model.controller.user.dto.response.LoginUserResponseDto;
import Model.controller.user.dto.response.RegisterUserResponseDto;
import Model.controller.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


import javax.management.relation.RoleNotFoundException;
import java.util.List;


@SpringBootTest(classes = App.class)
public class UserTest {

    @Autowired
    private UserService userService;



    @Test
    void loginUser()  {
        LoginUserResponseDto dto = userService.loginUser(new LoginUserRequestDto("mich@gmail.com", "starwarsjedi145"));
        System.out.println(dto.toString());
    }

    @Test
    void registerUser()   {
        RegisterUserResponseDto dto  = userService.registerUser(new RegisterUserRequestDto("Miguel Angel", "mich@gmail.com", "starwarsjedi145"));
        System.out.println(dto.toString());
    }


    @Test
    void registerUsers(){
        List<RegisterUserRequestDto> artists = List.of(
                new RegisterUserRequestDto("Trueno", "trueno@music.com", "password123"),
                new RegisterUserRequestDto("Taiu", "taiu@music.com", "password123"),
                new RegisterUserRequestDto("Evlay", "evlay@music.com", "password123"),
                new RegisterUserRequestDto("TATOOL", "tatool@music.com", "password123"),
                new RegisterUserRequestDto("Gustavo Santaolalla", "gustavo.santaolalla@music.com", "password123"),
                new RegisterUserRequestDto("Indio Solari", "indio.solari@music.com", "password123"),
                new RegisterUserRequestDto("Nicki Nicole", "nicki.nicole@music.com", "password123"),
                new RegisterUserRequestDto("Bizarrap", "bizarrap@music.com", "password123"),
                new RegisterUserRequestDto("ARKRIILA", "arkriila@music.com", "password123"),
                new RegisterUserRequestDto("Omar Courty", "omar.courty@music.com", "password123"),
                new RegisterUserRequestDto("Dei V", "dei.v@music.com", "password123"),
                new RegisterUserRequestDto("RailNao", "railnao@music.com", "password123"),
                new RegisterUserRequestDto("Chuwi", "chuwi@music.com", "password123"),
                new RegisterUserRequestDto("Missy Elliott", "missy.elliott@music.com", "password123"),
                new RegisterUserRequestDto("Michael Jackson", "michael.jackson@music.com", "password123"),
                new RegisterUserRequestDto("The Beatles", "the.beatles@music.com", "password123"),
                new RegisterUserRequestDto("Gorillaz", "gorillaz@music.com", "password123"),
                new RegisterUserRequestDto("Sean Paul", "sean.paul@music.com", "password123")
        );
        artists.forEach(artist -> userService.registerUser(artist));
    }




}