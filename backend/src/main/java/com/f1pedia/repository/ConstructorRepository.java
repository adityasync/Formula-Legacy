package com.f1pedia.repository;

import com.f1pedia.domain.Constructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConstructorRepository extends JpaRepository<Constructor, Integer> {
    java.util.List<Constructor> findByNameContainingIgnoreCase(String name);

    @org.springframework.data.jpa.repository.Query("SELECT new com.f1pedia.dto.ConstructorStatsDTO(" +
            "c.constructorId, c.name, c.nationality, c.constructorRef, " +
            "(SELECT COUNT(r) FROM Result r WHERE r.constructor = c AND r.positionOrder = 1), " +
            "(SELECT MIN(ra.year) FROM Result res JOIN res.race ra WHERE res.constructor = c), " +
            "(SELECT MAX(ra.year) FROM Result res JOIN res.race ra WHERE res.constructor = c)) " +
            "FROM Constructor c")
    java.util.List<com.f1pedia.dto.ConstructorStatsDTO> findAllWithStats();
}
