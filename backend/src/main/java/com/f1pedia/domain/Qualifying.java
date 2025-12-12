package com.f1pedia.domain;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "qualifying")
public class Qualifying {
    @Id
    @Column(name = "qualify_id")
    private Integer qualifyId;

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
    private Integer position;
    private String q1;
    private String q2;
    private String q3;
}
