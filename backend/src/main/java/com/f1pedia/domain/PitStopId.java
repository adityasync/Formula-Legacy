package com.f1pedia.domain;

import java.io.Serializable;
import lombok.Data;

@Data
public class PitStopId implements Serializable {
    private Integer raceId;
    private Integer driverId;
    private Integer stop;
}
