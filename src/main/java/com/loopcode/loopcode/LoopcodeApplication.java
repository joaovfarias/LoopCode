package com.loopcode.loopcode;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LoopcodeApplication {

	public static void main(String[] args) {
		SpringApplication.run(LoopcodeApplication.class, args);
	}

}
