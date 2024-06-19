package javamongo.com.example.javamongo.Api;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javamongo.com.example.javamongo.Damon.User;
import javamongo.com.example.javamongo.Services.UserService;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("users")
public class UserController {
    
    @Autowired
    private UserService userService;

    @GetMapping()
    public ResponseEntity<List<User>> getAll(){
        var response = userService.getAll();
        if(response!=null){
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/{email}")
    public ResponseEntity<User> getByEmail(@PathVariable String email){
        var response = userService.findEmail(email);
        if(response!=null){
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping()
    public ResponseEntity<?> createUsers(@RequestBody User request) throws Exception  {
        var response = userService.createUser(request);
        if(response!=null){
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUsers(@PathVariable UUID id, @RequestBody User request) {
        try {
            var response = userService.updateUser(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao atualizar o usuário");
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUsers(@PathVariable UUID id) throws Exception  {
        var response = userService.deleteUser(id);
        if(response!=null){
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().build();
    }


}
