package com.f1pedia.repository;

import com.f1pedia.domain.PitStop;
import com.f1pedia.domain.PitStopId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PitStopRepository extends JpaRepository<PitStop, PitStopId> {

    @Query(value = "SELECT d.surname as driver, AVG(ps.milliseconds) as avg_pit_ms " +
            "FROM pit_stops ps " +
            "JOIN drivers d ON ps.driver_id = d.driver_id " +
            "JOIN races r ON ps.race_id = r.race_id " +
            "WHERE r.year = :season " +
            "GROUP BY d.driver_id, d.surname " +
            "ORDER BY avg_pit_ms ASC " +
            "LIMIT 20", nativeQuery = true)
    List<Object[]> findPitStopEfficiencyBySeason(Integer season);

    @Query(value = "SELECT d.surname as driver, AVG(ps.milliseconds) as avg_pit_ms " +
            "FROM pit_stops ps " +
            "JOIN drivers d ON ps.driver_id = d.driver_id " +
            "GROUP BY d.driver_id, d.surname " +
            "ORDER BY avg_pit_ms ASC " +
            "LIMIT 20", nativeQuery = true)
    List<Object[]> findOverallPitStopEfficiency();
}
