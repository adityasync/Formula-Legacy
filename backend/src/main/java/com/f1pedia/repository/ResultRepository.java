package com.f1pedia.repository;

import com.f1pedia.domain.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResultRepository extends JpaRepository<Result, Integer> {
    List<Result> findByRace_RaceId(Integer raceId);

    List<Result> findByDriver_DriverId(Integer driverId);
}
