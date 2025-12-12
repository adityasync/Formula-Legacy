package com.f1pedia.repository;

import com.f1pedia.domain.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Integer> {
    Optional<Driver> findByDriverRef(String driverRef);

    Optional<Driver> findBySurname(String surname);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT r.driver FROM Result r WHERE r.constructor.constructorId = :constructorId")
    java.util.List<Driver> findDriversByConstructorId(Integer constructorId);
}
