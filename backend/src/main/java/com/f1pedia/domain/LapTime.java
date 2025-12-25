package com.f1pedia.domain;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "lap_times")
public class LapTime {

    @EmbeddedId
    private LapTimeId id;

    private Integer position;
    private String time;
    private Integer milliseconds;

    @ManyToOne
    @MapsId("raceId")
    @JoinColumn(name = "race_id")
    private Race race;

    @ManyToOne
    @MapsId("driverId")
    @JoinColumn(name = "driver_id")
    private Driver driver;
}
