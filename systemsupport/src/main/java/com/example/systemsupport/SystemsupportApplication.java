package com.example.systemsupport;

import com.example.systemsupport.entity.User;
import com.example.systemsupport.repository.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SystemsupportApplication {

	public static void main(String[] args) {
		SpringApplication.run(SystemsupportApplication.class, args);
	}

	/**
	 * Seeds the predefined admin user at startup if not already present.
	 */
	@Bean
	CommandLineRunner seedAdminUser(UserRepository userRepository) {
		return args -> {
			String adminEmail = "admin@mindx.com";
			if (!userRepository.existsByEmail(adminEmail)) {
				User admin = new User();
				admin.setName("admin");
				admin.setEmail(adminEmail);
				admin.setPassword(BCrypt.hashpw("Admin@123", BCrypt.gensalt()));
				admin.setMobileNumber("0000000000");
				admin.setRole("ADMIN");
				userRepository.save(admin);
				System.out.println("✅ Admin user seeded: admin@mindx.com");
			} else {
				System.out.println("ℹ️ Admin user already exists.");
			}
		};
	}
}
