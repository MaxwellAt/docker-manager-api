package com.example.javamysql.controller;

import com.example.javamysql.model.User;
import com.example.javamysql.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
