package com.example.javamysql.service;

import com.example.javamysql.model.User;
import com.example.javamysql.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User createUser (User request) throws Exception{

        if(request.getName()!=null){
            User user = userRepository.save(request);
            return user; 
        }
        return null;

    }

    public String updateUser(UUID id, User request) throws Exception {
        Optional<User> existingUser = userRepository.findById(id);

        try {
            if (existingUser.isPresent()) {
                User user = existingUser.get();

                user.setName(request.getName());
                user.setUsername(request.getUsername());
                user.setEmail(request.getEmail());
                user.setPassword(request.getPassword());
                user.setDateOfBirth(request.getDateOfBirth());
                user.setGender(request.getGender());
                user.setLocation(request.getLocation());

                userRepository.save(user);
                return "Usuario Atualizadooo";
            } else {
                return "Usuário não encontrado";
            }

        } catch (Exception e) {
            return "Erro ao atualizar o usuário: " + e.getMessage();
        }
    }

    public User findEmail (String email){
        return userRepository.findByEmail(email).orElse(null);
    }

    public List<User> getAll (){
        return userRepository.findAll();
    }

    public String deleteUser(UUID id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            userRepository.delete(user);
            return "Deletado";
        } else {
            return "Não foi deletado";
        }
    }
}
