package com.f1pedia.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "pit_stops")
@IdClass(PitStopId.class)
public class PitStop {
    @Id
    @Column(name = "race_id")
    private Integer raceId;

    @Id
    @Column(name = "driver_id")
    private Integer driverId;

    @Id
    private Integer stop;

    private Integer lap;
    private LocalTime time;
    private String duration;
    private Integer milliseconds;

    @ManyToOne
    @JoinColumn(name = "driver_id", insertable = false, updatable = false)
    private Driver driver;

    @ManyToOne
    @JoinColumn(name = "race_id", insertable = false, updatable = false)
    private Race race;
}
