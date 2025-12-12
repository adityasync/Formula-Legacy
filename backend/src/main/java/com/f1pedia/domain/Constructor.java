package com.f1pedia.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "constructors")
public class Constructor {
    @Id
    @Column(name = "constructor_id")
    private Integer constructorId;

    @Column(name = "constructor_ref")
    private String constructorRef;

    private String name;
    private String nationality;
    private String url;
}
