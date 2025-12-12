package com.f1pedia.controller;

import com.f1pedia.domain.Driver;
import com.f1pedia.repository.DriverRepository;
import com.f1pedia.repository.ResultRepository;
import com.f1pedia.domain.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "http://localhost:5173")
public class DriverController {

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Driver> getDriverById(@PathVariable Integer id) {
        return driverRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Full driver career stats
     */
    @GetMapping("/{id}/career")
    public ResponseEntity<Map<String, Object>> getDriverCareer(@PathVariable Integer id) {
        Optional<Driver> driverOpt = driverRepository.findById(id);
        if (driverOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Driver driver = driverOpt.get();
        Map<String, Object> career = new HashMap<>();

        // Basic info
        career.put("driverId", driver.getDriverId());
        career.put("forename", driver.getForename());
        career.put("surname", driver.getSurname());
        career.put("code", driver.getCode());
        career.put("nationality", driver.getNationality());
        career.put("dob", driver.getDob());
        career.put("url", driver.getUrl());

        // Career totals
        String totalsSql = """
                SELECT COUNT(*) as races,
                       SUM(r.points) as total_points,
                       COUNT(CASE WHEN r.position = 1 THEN 1 END) as wins,
                       COUNT(CASE WHEN r.position <= 3 THEN 1 END) as podiums,
                       COUNT(CASE WHEN r.grid = 1 THEN 1 END) as poles,
                       COUNT(CASE WHEN r.rank = 1 THEN 1 END) as fastest_laps,
                       MIN(ra.year) as first_year,
                       MAX(ra.year) as last_year
                FROM results r
                JOIN races ra ON r.race_id = ra.race_id
                WHERE r.driver_id = ?
                """;
        Map<String, Object> totals = jdbcTemplate.queryForMap(totalsSql, id);
        career.putAll(totals);

        // Teams driven for
        String teamsSql = """
                SELECT DISTINCT c.constructor_id, c.name, c.nationality,
                       MIN(ra.year) as from_year, MAX(ra.year) as to_year,
                       COUNT(*) as races, SUM(r.points) as points,
                       COUNT(CASE WHEN r.position = 1 THEN 1 END) as wins
                FROM results r
                JOIN constructors c ON r.constructor_id = c.constructor_id
                JOIN races ra ON r.race_id = ra.race_id
                WHERE r.driver_id = ?
                GROUP BY c.constructor_id, c.name, c.nationality
                ORDER BY from_year DESC
                """;
        List<Map<String, Object>> teams = jdbcTemplate.queryForList(teamsSql, id);
        career.put("teams", teams);

        // Season by season breakdown
        String seasonsSql = """
                SELECT ra.year,
                       c.name as team,
                       COUNT(*) as races,
                       SUM(r.points) as points,
                       COUNT(CASE WHEN r.position = 1 THEN 1 END) as wins,
                       COUNT(CASE WHEN r.position <= 3 THEN 1 END) as podiums,
                       COUNT(CASE WHEN r.grid = 1 THEN 1 END) as poles,
                       ds.position as championship_position
                FROM results r
                JOIN races ra ON r.race_id = ra.race_id
                JOIN constructors c ON r.constructor_id = c.constructor_id
                LEFT JOIN (
                    SELECT driver_id, race_id, position
                    FROM driver_standings ds1
                    WHERE ds1.race_id = (
                        SELECT MAX(ds2.race_id)
                        FROM driver_standings ds2
                        JOIN races r2 ON ds2.race_id = r2.race_id
                        WHERE ds2.driver_id = ds1.driver_id AND r2.year = (
                            SELECT year FROM races WHERE race_id = ds1.race_id
                        )
                    )
                ) ds ON ds.driver_id = r.driver_id AND ds.race_id = (
                    SELECT MAX(race_id) FROM races WHERE year = ra.year
                )
                WHERE r.driver_id = ?
                GROUP BY ra.year, c.name, ds.position
                ORDER BY ra.year DESC
                """;
        List<Map<String, Object>> seasons = jdbcTemplate.queryForList(seasonsSql, id);
        career.put("seasons", seasons);

        // Best results
        String bestSql = """
                SELECT ra.name as race, ra.year, c.name as team, r.position, r.points
                FROM results r
                JOIN races ra ON r.race_id = ra.race_id
                JOIN constructors c ON r.constructor_id = c.constructor_id
                WHERE r.driver_id = ? AND r.position IS NOT NULL
                ORDER BY r.points DESC, r.position ASC
                LIMIT 10
                """;
        List<Map<String, Object>> bestResults = jdbcTemplate.queryForList(bestSql, id);
        career.put("bestResults", bestResults);

        return ResponseEntity.ok(career);
    }

    /**
     * Driver championship history
     */
    @GetMapping("/{id}/championships")
    public List<Map<String, Object>> getDriverChampionships(@PathVariable Integer id) {
        String sql = """
                SELECT ra.year, ds.points, ds.position, ds.wins
                FROM driver_standings ds
                JOIN races ra ON ds.race_id = ra.race_id
                WHERE ds.driver_id = ?
                  AND ds.race_id IN (
                      SELECT MAX(race_id) FROM races GROUP BY year
                  )
                ORDER BY ra.year DESC
                """;
        return jdbcTemplate.queryForList(sql, id);
    }

    /**
     * Driver vs circuit performance
     */
    @GetMapping("/{id}/circuits")
    public List<Map<String, Object>> getDriverCircuitPerformance(@PathVariable Integer id) {
        String sql = """
                SELECT ci.name as circuit, ci.country,
                       COUNT(*) as races,
                       ROUND(AVG(r.position), 2) as avg_finish,
                       COUNT(CASE WHEN r.position = 1 THEN 1 END) as wins,
                       COUNT(CASE WHEN r.position <= 3 THEN 1 END) as podiums,
                       SUM(r.points) as total_points
                FROM results r
                JOIN races ra ON r.race_id = ra.race_id
                JOIN circuits ci ON ra.circuit_id = ci.circuit_id
                WHERE r.driver_id = ? AND r.position IS NOT NULL
                GROUP BY ci.circuit_id, ci.name, ci.country
                HAVING COUNT(*) >= 2
                ORDER BY avg_finish ASC
                """;
        return jdbcTemplate.queryForList(sql, id);
    }
}
