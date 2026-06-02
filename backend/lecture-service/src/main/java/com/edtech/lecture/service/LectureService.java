package com.edtech.lecture.service;

import com.edtech.lecture.entity.Lecture;
import com.edtech.lecture.repository.LectureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class LectureService {

    @Autowired
    private LectureRepository repository;

    public Lecture addLecture(Lecture lecture) {
        if (lecture.getYoutubeUrl() != null) {
            lecture.setVideoId(extractVideoId(lecture.getYoutubeUrl()));
        }
        return repository.save(lecture);
    }

    public List<Lecture> getLecturesByCourse(Long courseId) {
        return repository.findByCourseIdOrderByOrderIndexAsc(courseId);
    }

    public Lecture getLectureById(Long id) {
        Optional<Lecture> lecture = repository.findById(id);
        return lecture.orElseThrow(() -> new RuntimeException("Lecture not found"));
    }

    private String extractVideoId(String youtubeUrl) {
        String videoId = null;
        String pattern = "(?<=watch\\?v=|/videos/|embed\\/|youtu.be\\/|\\/v\\/|\\/e\\/|watch\\?v%3D|watch\\?feature=player_embedded&v=|%2Fvideos%2F|embed%\u200C\u200B2F|youtu.be%2F|%2Fv%2F)[^#\\&\\?\\n]*";
        Pattern compiledPattern = Pattern.compile(pattern);
        Matcher matcher = compiledPattern.matcher(youtubeUrl);
        if (matcher.find()) {
            videoId = matcher.group();
        }
        return videoId;
    }
}
