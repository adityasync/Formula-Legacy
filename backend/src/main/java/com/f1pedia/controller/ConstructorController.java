package com.f1pedia.controller;

import com.f1pedia.domain.Constructor;
import com.f1pedia.repository.ConstructorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/constructors")
@CrossOrigin(origins = "http://localhost:5173")
public class ConstructorController {

    @Autowired
    private ConstructorRepository constructorRepository;

    @GetMapping
    public List<Constructor> getAllConstructors() {
        return constructorRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Constructor> getConstructorById(@PathVariable Integer id) {
        return constructorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Autowired
    private com.f1pedia.repository.DriverRepository driverRepository;

    @Autowired
    private com.f1pedia.repository.ResultRepository resultRepository;

    @GetMapping("/{id}/drivers")
    public List<com.f1pedia.domain.Driver> getDriversByConstructor(@PathVariable Integer id) {
        return driverRepository.findDriversByConstructorId(id);
    }

    @GetMapping("/{id}/driver-stats")
    public List<java.util.Map<String, Object>> getDriverStatsByConstructor(@PathVariable Integer id) {
        List<com.f1pedia.domain.Driver> drivers = driverRepository.findDriversByConstructorId(id);
        return drivers.stream().map(driver -> {
            java.util.Map<String, Object> stats = new java.util.HashMap<>();
            stats.put("driverId", driver.getDriverId());
            stats.put("forename", driver.getForename());
            stats.put("surname", driver.getSurname());
            stats.put("code", driver.getCode());
            stats.put("nationality", driver.getNationality());

            // Get results for this driver with this constructor
            List<com.f1pedia.domain.Result> results = resultRepository.findByDriverDriverId(driver.getDriverId());
            List<com.f1pedia.domain.Result> teamResults = results.stream()
                    .filter(r -> r.getConstructor() != null && r.getConstructor().getConstructorId().equals(id))
                    .toList();

            // Calculate total points
            double totalPoints = teamResults.stream()
                    .filter(r -> r.getPoints() != null)
                    .mapToDouble(com.f1pedia.domain.Result::getPoints)
                    .sum();
            stats.put("totalPoints", totalPoints);

            // Calculate wins
            long wins = teamResults.stream()
                    .filter(r -> r.getPosition() != null && r.getPosition() == 1)
                    .count();
            stats.put("wins", wins);

            // Calculate podiums
            long podiums = teamResults.stream()
                    .filter(r -> r.getPosition() != null && r.getPosition() <= 3)
                    .count();
            stats.put("podiums", podiums);

            // Calculate active years
            java.util.Set<Integer> years = teamResults.stream()
                    .filter(r -> r.getRace() != null)
                    .map(r -> r.getRace().getYear())
                    .collect(java.util.stream.Collectors.toSet());
            if (!years.isEmpty()) {
                int minYear = years.stream().min(Integer::compareTo).orElse(0);
                int maxYear = years.stream().max(Integer::compareTo).orElse(0);
                stats.put("firstYear", minYear);
                stats.put("lastYear", maxYear);
                stats.put("yearsActive", minYear == maxYear ? String.valueOf(minYear) : minYear + "-" + maxYear);
            } else {
                stats.put("yearsActive", "N/A");
            }

            stats.put("races", teamResults.size());

            return stats;
        }).sorted((a, b) -> Double.compare((Double) b.get("totalPoints"), (Double) a.get("totalPoints")))
                .toList();
    }
}
