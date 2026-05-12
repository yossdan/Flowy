package Model.controller.user.dto.response;

public record UserDetailResponseDto(
        String name,
        String email,
        String role

) {
    @Override
    public String toString() {
        return "UserDetailResponseDto{" +
                "name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}
