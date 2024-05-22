package javamongo.com.example.javamongo.Services;

import java.util.List;
import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javamongo.com.example.javamongo.Damon.User;
import javamongo.com.example.javamongo.Infra.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;


    public String createUser (User request) throws Exception{

        if(request.getName()!=null){
            userRepository.save(request);
            return "Usuario criado";
        }
        return "Erro ao criar o usuario";

    }

    public String updateUser(User request) throws Exception {
        Optional<User> existingUser = userRepository.findByName(request.getName());
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

    public String deleteUser(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            userRepository.delete(user);
            return "Deletado";
        } else {
            return "Não foi deletado";
        }
    }

}
