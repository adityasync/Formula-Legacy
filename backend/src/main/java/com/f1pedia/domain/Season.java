package com.f1pedia.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "seasons")
public class Season {
    @Id
    private Integer year;
    private String url;
}
