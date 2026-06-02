package com.edtech.course.service;

import com.edtech.course.entity.Course;
import com.edtech.course.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository repository;

    @CacheEvict(value = "courses", allEntries = true)
    public Course createCourse(Course course) {
        return repository.save(course);
    }

    @Cacheable(value = "courses")
    public List<Course> getAllPublishedCourses() {
        return repository.findByStatus("PUBLISHED");
    }

    public List<Course> getCoursesByInstructor(String instructorId) {
        return repository.findByInstructorId(instructorId);
    }

    public Course getCourseById(Long id) {
        Optional<Course> course = repository.findById(id);
        return course.orElseThrow(() -> new RuntimeException("Course not found"));
    }

    @CacheEvict(value = "courses", allEntries = true)
    public Course updateCourse(Long id, Course courseDetails) {
        Course course = getCourseById(id);
        course.setTitle(courseDetails.getTitle());
        course.setDescription(courseDetails.getDescription());
        course.setCategory(courseDetails.getCategory());
        course.setPrice(courseDetails.getPrice());
        course.setThumbnailUrl(courseDetails.getThumbnailUrl());
        course.setStatus(courseDetails.getStatus() != null ? courseDetails.getStatus() : course.getStatus());
        return repository.save(course);
    }

    @CacheEvict(value = "courses", allEntries = true)
    public void deleteCourse(Long id) {
        Course course = getCourseById(id);
        repository.delete(course);
    }

    /**
     * Admin-only: returns every course regardless of status.
     */
    public List<Course> getAllCourses() {
        return repository.findAll();
    }

    /**
     * Admin-only: publish a course by setting its status to PUBLISHED.
     */
    @CacheEvict(value = "courses", allEntries = true)
    public Course publishCourse(Long id) {
        Course course = getCourseById(id);
        course.setStatus("PUBLISHED");
        return repository.save(course);
    }
}
