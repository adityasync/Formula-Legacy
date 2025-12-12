package com.f1pedia.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "circuits")
public class Circuit {
    @Id
    @Column(name = "circuit_id")
    private Integer circuitId;

    @Column(name = "circuit_ref")
    private String circuitRef;

    private String name;
    private String location;
    private String country;
    private Double lat;
    private Double lng;
    private Integer alt;
    private String url;
}
