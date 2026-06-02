package com.edtech.user.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfile {

    @Id
    private String email;
    private String firstName;
    private String lastName;
    private String bio;
    private String avatarUrl;
    private String phoneNumber;
}
