package Model.controller.user.repository;

import Model.controller.role.entities.RoleEntity;
import Model.controller.user.dto.request.RegisterUserRequestDto;
import Model.controller.user.dto.request.UpdateUserRequestDto;
import Model.controller.user.entities.UserEntity;
import Model.controller.user.exception.UserException;
import Model.util.CryptoUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class UserQueryRepository {

    private final CryptoUtil cryptoUtil;
    private final UserRepository repository;

    @Autowired
    public UserQueryRepository(CryptoUtil cryptoUtil, UserRepository repository) {
        this.cryptoUtil = cryptoUtil;
        this.repository = repository;
    }

    public UserEntity registerUser(RegisterUserRequestDto dto, String profilePhotoObjectKey, RoleEntity roleEntity) {
        if (repository.existsByEmail(dto.email())) {
            throw new UserException(
                    "El correo electrónico ingresado ya está asociado a otro usuario. Por favor, utiliza una dirección diferente para continuar con el registro.");
        }
        return repository.save(new UserEntity(dto.name(), dto.email(), cryptoUtil.encode(dto.password()),
                profilePhotoObjectKey, roleEntity));
    }

    public UserEntity loginUser(String email, String password) {
        Optional<UserEntity> optionalUserEntity = repository.findByEmail(email);
        if (optionalUserEntity.isEmpty()) {
            throw new UserException(
                    "No encontramos ningún usuario con el correo ingresado. Por favor, verifica los datos y vuelve a intentarlo. Si aún no tienes una cuenta, puedes crear una nueva en el botón de Registro.");
        }
        UserEntity userEntity = optionalUserEntity.get();

        if (!cryptoUtil.matches(password, userEntity.getPassword())) {
            throw new UserException(
                    "La autenticación no fue posible porque la contraseña proporcionada es incorrecta. Puedes volver a intentarlo o restablecerla desde la opción '¿Olvidaste tu contraseña?'.");
        }
        return userEntity;
    }

    public List<UserEntity> findUsersByIds(List<UUID> userIds) {
        return repository.findAllById(userIds);
    }

    @Transactional
    public void updateUser(UpdateUserRequestDto dto, RoleEntity roleEntity) {
        Optional<UserEntity> optionalUserEntity = repository.findById(dto.userId());
        if (optionalUserEntity.isPresent()) {
            UserEntity userEntity = optionalUserEntity.get();
            userEntity.setRoleId(roleEntity);
            repository.save(userEntity);
        }
    }

    public UserEntity findUserById(UUID userId) {
        return repository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public UserEntity save(UserEntity userEntity) {
        return repository.save(userEntity);
    }
}
