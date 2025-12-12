package com.f1pedia.repository;

import com.f1pedia.domain.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResultRepository extends JpaRepository<Result, Integer> {
    List<Result> findByRace_RaceId(Integer raceId);

    List<Result> findByDriverDriverId(Integer driverId);

    List<Result> findByConstructorConstructorId(Integer constructorId);

    @org.springframework.data.jpa.repository.Query(value = "SELECT s.status, COUNT(*) as count " +
            "FROM results r " +
            "JOIN status s ON r.status_id = s.status_id " +
            "WHERE s.status != 'Finished' AND s.status NOT LIKE '%Lap%' " +
            "GROUP BY s.status " +
            "ORDER BY count DESC " +
            "LIMIT 15", nativeQuery = true)
    java.util.List<Object[]> findDNFCauseCounts();
}
