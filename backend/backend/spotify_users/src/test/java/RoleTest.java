import App.App;
import Model.controller.role_new.service.component.RoleRegistrationComponent;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(classes = App.class)
public class RoleTest {
    @Autowired
    RoleRegistrationComponent registration;

    @Test
    void registerRole() {
        registration.registerRole("Artista");
        registration.registerRole("Usuario");
    }
}
