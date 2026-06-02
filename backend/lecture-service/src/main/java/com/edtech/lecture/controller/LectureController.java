package com.edtech.lecture.controller;

import com.edtech.lecture.entity.Lecture;
import com.edtech.lecture.service.LectureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/lectures")
public class LectureController {

    @Autowired
    private LectureService service;

    /**
     * HIGH-02: Instructor-only endpoint.
     * The api-gateway AuthenticationFilter extracts the role claim from the JWT
     * and forwards it as the X-User-Role header. Only INSTRUCTOR or ADMIN roles
     * may add lectures to a course.
     *
     * Note: For full ownership verification (ensuring the instructor owns the specific
     * course), a call to course-service would be needed (future enhancement).
     */
    @PostMapping
    public Lecture addLecture(@RequestBody Lecture lecture,
                              @RequestHeader("loggedInUser") String loggedInUser,
                              @RequestHeader(value = "X-User-Role", defaultValue = "STUDENT") String userRole) {
        if (!"INSTRUCTOR".equalsIgnoreCase(userRole) && !"ADMIN".equalsIgnoreCase(userRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Only instructors can add lectures");
        }
        return service.addLecture(lecture);
    }

    @GetMapping("/course/{courseId}")
    public List<Lecture> getLecturesByCourse(@PathVariable Long courseId) {
        return service.getLecturesByCourse(courseId);
    }

    @GetMapping("/{id}")
    public Lecture getLectureById(@PathVariable Long id) {
        return service.getLectureById(id);
    }
}
