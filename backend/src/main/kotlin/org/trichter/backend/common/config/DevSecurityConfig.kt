package org.trichter.backend.common.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.web.SecurityFilterChain

@Configuration
@Profile("dev")
class DevSecurityConfig {
    @Bean
    fun devSecurityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .authorizeHttpRequests {
                it.anyRequest().permitAll()
            }
            .httpBasic { it.disable() }
            .formLogin { it.disable() }
            .oauth2Login { it.disable() }
            .logout(Customizer.withDefaults())

        return http.build()
    }
}