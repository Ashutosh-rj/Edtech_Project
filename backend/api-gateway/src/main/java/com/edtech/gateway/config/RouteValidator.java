package com.edtech.gateway.config;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    public static final List<String> openApiEndpoints = List.of(
            "/auth/register",
            "/auth/login",
            "/eureka",
            "/users/uploads"
    );

    public Predicate<ServerHttpRequest> isSecured =
            request -> {
                String method = request.getMethod().name();

                // Allow CORS preflight
                if (method.equals("OPTIONS")) return false;

                String path = request.getURI().getPath();

                // Allow public access to GET /courses for browsing
                if (method.equals("GET") && path.startsWith("/courses")) {
                    // But keep /courses/instructor, /courses/all (Admin) protected if they exist
                    if (!path.contains("/instructor") && !path.contains("/all")) {
                        return false; // not secured
                    }
                }

                return openApiEndpoints
                        .stream()
                        .noneMatch(uri -> path.contains(uri));
            };
}
