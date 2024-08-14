package javamongo.com.example.javamongo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class JavamongoApplication {
	public static void main(String[] args) {
		SpringApplication.run(JavamongoApplication.class, args);
		System.out.println(System.getenv("TEMP"));

	}

}
