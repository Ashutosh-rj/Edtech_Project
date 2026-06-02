package com.edtech.gateway.filter;

import com.edtech.gateway.config.JwtUtil;
import com.edtech.gateway.config.RouteValidator;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Autowired
    private RouteValidator validator;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return ((exchange, chain) -> {
            if (validator.isSecured.test(exchange.getRequest())) {
                // Verify Authorization header exists
                if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing authorization header");
                }

                String authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    authHeader = authHeader.substring(7);
                } else {
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid authorization header format");
                }

                try {
                    jwtUtil.validateToken(authHeader);

                    Claims claims = jwtUtil.getClaims(authHeader);

                    // Forward the user's email as loggedInUser header for downstream services
                    String userId = claims.getSubject();

                    // MED-01 / HIGH-02: Forward role claim so downstream services can enforce RBAC
                    String role = claims.get("role", String.class);
                    if (role == null) role = "STUDENT";

                    final String finalRole = role;
                    exchange = exchange.mutate()
                            .request(r -> r
                                    .header("loggedInUser", userId)
                                    .header("X-User-Role", finalRole))
                            .build();

                } catch (Exception e) {
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized: invalid or expired token");
                }
            }
            return chain.filter(exchange);
        });
    }

    public static class Config {
    }
}
