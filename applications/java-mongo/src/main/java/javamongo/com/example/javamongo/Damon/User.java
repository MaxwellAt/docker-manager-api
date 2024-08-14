package javamongo.com.example.javamongo.Damon;

import java.util.UUID;

import org.springframework.data.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    
    @Id
    private UUID id=UUID.randomUUID();
    private String name;
    private String username;
    private String email;
    private String password;
    private String dateOfBirth;
    private String gender;
    private String location;
}
