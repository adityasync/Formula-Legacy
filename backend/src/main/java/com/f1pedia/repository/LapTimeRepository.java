package com.f1pedia.repository;

import com.f1pedia.domain.LapTime;
import com.f1pedia.domain.LapTimeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LapTimeRepository extends JpaRepository<LapTime, LapTimeId> {
    List<LapTime> findByIdRaceIdOrderByIdLapAsc(Integer raceId);
}
