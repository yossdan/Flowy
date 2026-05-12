package Model.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class CryptoUtil {

    private final BCryptPasswordEncoder encoder;

    public CryptoUtil() {
        this.encoder = new BCryptPasswordEncoder();
    }

    public String encode(String password) {
        return encoder.encode(password);
    }

    public boolean matches(String password, String encodedPassword) {
        return encoder.matches(password, encodedPassword);
    }
}
