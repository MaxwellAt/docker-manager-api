package javamongo.com.example.javamongo.Infra;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.mongodb.repository.MongoRepository;

import javamongo.com.example.javamongo.Damon.User;

public interface UserRepository extends MongoRepository<User, UUID> {
    
    Optional<User> findById(UUID id);
    Optional<User> findByEmail(String email);

    Optional<User> findByName(String name);
    Optional<User> deleteByEmail(String email);
}
