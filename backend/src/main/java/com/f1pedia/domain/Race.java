package com.f1pedia.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "races")
public class Race {
    @Id
    @Column(name = "race_id")
    private Integer raceId;

    private Integer year;
    private Integer round;

    @Column(name = "circuit_id")
    private Integer circuitId;

    private String name;
    private LocalDate date;
    private LocalTime time;
    private String url;

    @Column(name = "fp1_date")
    private LocalDate fp1Date;
    @Column(name = "fp1_time")
    private LocalTime fp1Time;
    @Column(name = "fp2_date")
    private LocalDate fp2Date;
    @Column(name = "fp2_time")
    private LocalTime fp2Time;
    @Column(name = "fp3_date")
    private LocalDate fp3Date;
    @Column(name = "fp3_time")
    private LocalTime fp3Time;
    @Column(name = "quali_date")
    private LocalDate qualiDate;
    @Column(name = "quali_time")
    private LocalTime qualiTime;
    @Column(name = "sprint_date")
    private LocalDate sprintDate;
    @Column(name = "sprint_time")
    private LocalTime sprintTime;
}
