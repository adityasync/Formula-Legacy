package com.f1pedia.domain;

import java.io.Serializable;
import java.util.Objects;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class LapTimeId implements Serializable {

    @Column(name = "race_id")
    private Integer raceId;

    @Column(name = "driver_id")
    private Integer driverId;

    @Column(name = "lap")
    private Integer lap;

    public LapTimeId() {
    }

    public LapTimeId(Integer raceId, Integer driverId, Integer lap) {
        this.raceId = raceId;
        this.driverId = driverId;
        this.lap = lap;
    }

    public Integer getRaceId() {
        return raceId;
    }

    public void setRaceId(Integer raceId) {
        this.raceId = raceId;
    }

    public Integer getDriverId() {
        return driverId;
    }

    public void setDriverId(Integer driverId) {
        this.driverId = driverId;
    }

    public Integer getLap() {
        return lap;
    }

    public void setLap(Integer lap) {
        this.lap = lap;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        LapTimeId lapTimeId = (LapTimeId) o;
        return Objects.equals(raceId, lapTimeId.raceId) &&
                Objects.equals(driverId, lapTimeId.driverId) &&
                Objects.equals(lap, lapTimeId.lap);
    }

    @Override
    public int hashCode() {
        return Objects.hash(raceId, driverId, lap);
    }
}
