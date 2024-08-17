package com.example.javamysql;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
public class JavaMysqlApplication {

	public static void main(String[] args) {
		SpringApplication.run(JavaMysqlApplication.class, args);
	}

}
