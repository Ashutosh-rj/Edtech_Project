package com.edtech.course.controller;

import com.edtech.course.entity.Course;
import com.edtech.course.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseService service;

    // ─── Public / Student ────────────────────────────────────────────────────

    /** Returns only PUBLISHED courses — visible to everyone. */
    @GetMapping
    public List<Course> getAllPublishedCourses() {
        return service.getAllPublishedCourses();
    }

    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable Long id) {
        return service.getCourseById(id);
    }

    // ─── Instructor / Admin ───────────────────────────────────────────────────

    /**
     * Create a course.
     * INSTRUCTOR: becomes the owner (instructorId = loggedInUser).
     * ADMIN: can set any instructorId or defaults to their own identity.
     */
    @PostMapping
    public Course createCourse(
            @RequestBody Course course,
            @RequestHeader("loggedInUser") String loggedInUser,
            @RequestHeader(value = "X-User-Role", defaultValue = "STUDENT") String userRole) {

        if (!"INSTRUCTOR".equalsIgnoreCase(userRole) && !"ADMIN".equalsIgnoreCase(userRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only instructors or admins can create courses");
        }
        // For ADMIN keep whatever instructorId is set in body; fall back to loggedInUser
        if (course.getInstructorId() == null || course.getInstructorId().isBlank()) {
            course.setInstructorId(loggedInUser);
        }
        if (course.getStatus() == null) {
            course.setStatus("DRAFT");
        }
        return service.createCourse(course);
    }

    /** Returns courses belonging to the logged-in instructor. */
    @GetMapping("/instructor")
    public List<Course> getCoursesByInstructor(@RequestHeader("loggedInUser") String loggedInUser) {
        return service.getCoursesByInstructor(loggedInUser);
    }

    /**
     * Admin-only: returns ALL courses regardless of status or instructor.
     */
    @GetMapping("/all")
    public List<Course> getAllCourses(
            @RequestHeader(value = "X-User-Role", defaultValue = "STUDENT") String userRole) {
        if (!"ADMIN".equalsIgnoreCase(userRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can view all courses");
        }
        return service.getAllCourses();
    }

    /**
     * Update a course.
     * INSTRUCTOR: must own the course.
     * ADMIN: can update any course.
     */
    @PutMapping("/{id}")
    public Course updateCourse(
            @PathVariable Long id,
            @RequestBody Course courseDetails,
            @RequestHeader("loggedInUser") String loggedInUser,
            @RequestHeader(value = "X-User-Role", defaultValue = "STUDENT") String userRole) {

        Course existingCourse = service.getCourseById(id);
        boolean isAdmin = "ADMIN".equalsIgnoreCase(userRole);
        if (!isAdmin && !existingCourse.getInstructorId().equals(loggedInUser)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to update this course");
        }
        return service.updateCourse(id, courseDetails);
    }

    /**
     * Delete a course.
     * INSTRUCTOR: must own the course.
     * ADMIN: can delete any course.
     */
    @DeleteMapping("/{id}")
    public void deleteCourse(
            @PathVariable Long id,
            @RequestHeader("loggedInUser") String loggedInUser,
            @RequestHeader(value = "X-User-Role", defaultValue = "STUDENT") String userRole) {

        Course existingCourse = service.getCourseById(id);
        boolean isAdmin = "ADMIN".equalsIgnoreCase(userRole);
        if (!isAdmin && !existingCourse.getInstructorId().equals(loggedInUser)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to delete this course");
        }
        service.deleteCourse(id);
    }

    /**
     * Admin-only: publish (or re-publish) any course immediately.
     */
    @PutMapping("/{id}/publish")
    public Course publishCourse(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Role", defaultValue = "STUDENT") String userRole) {
        if (!"ADMIN".equalsIgnoreCase(userRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can publish courses");
        }
        return service.publishCourse(id);
    }
}
