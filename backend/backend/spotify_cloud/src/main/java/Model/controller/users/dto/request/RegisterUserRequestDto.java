package Model.controller.users.dto.request;

public record RegisterUserRequestDto(
        String name,
        String email,
        String password
)
{

}
