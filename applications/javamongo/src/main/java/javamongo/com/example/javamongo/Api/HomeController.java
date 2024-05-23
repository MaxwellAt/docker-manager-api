package javamongo.com.example.javamongo.Api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/")
public class HomeController{

    @GetMapping("/")
    public Map<String, Object> getData() {
        Map<String, Object> response = new HashMap<>();
        response.put("info", "Basic movies API");
        response.put("paths", new String[]{"/users", "/users/:id"});
        return response;
    }
}