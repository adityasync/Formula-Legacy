package com.f1pedia.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "status")
public class Status {
    @Id
    @Column(name = "status_id")
    private Integer statusId;
    private String status;
}
