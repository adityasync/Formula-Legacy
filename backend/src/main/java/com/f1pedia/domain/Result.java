package com.f1pedia.domain;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "results")
public class Result {
    @Id
    @Column(name = "result_id")
    private Integer resultId;

    @ManyToOne
    @JoinColumn(name = "race_id")
    private Race race;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @ManyToOne
    @JoinColumn(name = "constructor_id")
    private Constructor constructor;

    private Integer number;
    private Integer grid;
    private Integer position;

    @Column(name = "position_text")
    private String positionText;

    @Column(name = "position_order")
    private Integer positionOrder;

    private Double points;
    private Integer laps;
    private String time;
    private Integer milliseconds;

    @Column(name = "fastest_lap")
    private Integer fastestLap;

    private Integer rank;

    @Column(name = "fastest_lap_time")
    private String fastestLapTime;

    @Column(name = "fastest_lap_speed")
    private String fastestLapSpeed;

    @ManyToOne
    @JoinColumn(name = "status_id")
    private Status status;
}
