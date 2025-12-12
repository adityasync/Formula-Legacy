package com.f1pedia.repository;

import com.f1pedia.domain.Qualifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QualifyingRepository extends JpaRepository<Qualifying, Integer> {

    @Query(value = "SELECT r.name as race_name, q.position as quali_pos, res.position as race_pos, " +
            "(q.position - res.position) as delta " +
            "FROM qualifying q " +
            "JOIN results res ON q.race_id = res.race_id AND q.driver_id = res.driver_id " +
            "JOIN races r ON q.race_id = r.race_id " +
            "WHERE q.driver_id = :driverId " +
            "ORDER BY r.date DESC " +
            "LIMIT 50", nativeQuery = true)
    List<Object[]> findQualiVsRaceByDriver(Integer driverId);
}
