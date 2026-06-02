package com.edtech.auth.service;

/**
 * DEPRECATED — This class is dead code and should be deleted.
 *
 * It was a duplicate of JwtService with a different hardcoded secret and
 * different token expiry (10h vs 24h). AuthService uses JwtService exclusively.
 *
 * Kept as a plain class (no @Component) so Spring does not instantiate it.
 * TODO: Delete this file entirely in a future cleanup.
 */
@Deprecated
public class JwtUtil {
    // Intentionally empty — see JwtService.java
}
