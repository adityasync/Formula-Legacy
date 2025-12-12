package com.f1pedia.repository;

import com.f1pedia.domain.Race;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RaceRepository extends JpaRepository<Race, Integer> {
    List<Race> findByYear(Integer year);
}
