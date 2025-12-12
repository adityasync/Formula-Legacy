package com.f1pedia.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "drivers")
public class Driver {
    @Id
    @Column(name = "driver_id")
    private Integer driverId;

    @Column(name = "driver_ref")
    private String driverRef;

    private Integer number;
    private String code;
    private String forename;
    private String surname;
    private LocalDate dob;
    private String nationality;
    private String url;
}
