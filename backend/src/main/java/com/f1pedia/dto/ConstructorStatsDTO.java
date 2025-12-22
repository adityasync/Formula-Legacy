package com.f1pedia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConstructorStatsDTO {
    private Integer constructorId;
    private String name;
    private String nationality;
    private String constructorRef;
    private Long totalWins;
    private Integer firstYear;
    private Integer lastYear;
}
