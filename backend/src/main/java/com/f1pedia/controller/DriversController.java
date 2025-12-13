package com.f1pedia.controller;

import com.f1pedia.domain.Driver;
import com.f1pedia.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/drivers")
public class DriversController {

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    /**
     * Get driver statistics for head-to-head comparisons.
     * Returns aggregated stats for all drivers with significant race history.
     */
    @GetMapping("/stats")
    public List<Map<String, Object>> getDriverStats() {
        String sql = """
                SELECT
                    d.driver_id as "driverId",
                    d.forename || ' ' || d.surname as name,
                    d.code,
                    d.nationality,
                    COUNT(DISTINCT r.race_id) as races,
                    COUNT(CASE WHEN r.position = 1 THEN 1 END) as wins,
                    COUNT(CASE WHEN r.grid = 1 THEN 1 END) as poles,
                    COUNT(CASE WHEN r.position <= 3 THEN 1 END) as podiums,
                    ROUND(100.0 * COUNT(CASE WHEN r.position = 1 THEN 1 END) / COUNT(*), 2) as win_rate,
                    ROUND(100.0 * COUNT(CASE WHEN r.grid = 1 THEN 1 END) / COUNT(*), 2) as pole_rate,
                    ROUND(100.0 * COUNT(CASE WHEN s.status != 'Finished' AND s.status NOT LIKE '+%' THEN 1 END) / COUNT(*), 2) as dnf_rate,
                    COUNT(DISTINCT ra.year) as seasons
                FROM drivers d
                JOIN results r ON d.driver_id = r.driver_id
                JOIN races ra ON r.race_id = ra.race_id
                JOIN status s ON r.status_id = s.status_id
                GROUP BY d.driver_id, d.forename, d.surname, d.code, d.nationality
                HAVING COUNT(DISTINCT r.race_id) >= 20
                ORDER BY wins DESC, podiums DESC
                LIMIT 100
                """;
        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Driver> getDriverById(@PathVariable int id) {
        return driverRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Full driver career stats
     */
    @GetMapping("/{id}/career")
    public ResponseEntity<Map<String, Object>> getDriverCareer(@PathVariable int id) {
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
    public List<Map<String, Object>> getDriverChampionships(@PathVariable int id) {
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
    public List<Map<String, Object>> getDriverCircuitPerformance(@PathVariable int id) {
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

    /**
     * Driver evolution over years
     */
    @GetMapping("/{id}/evolution")
    public List<Map<String, Object>> getDriverEvolution(@PathVariable int id) {
        String sql = """
                SELECT ra.year,
                       ROUND(CAST(AVG(NULLIF(r.grid, 0)) AS NUMERIC), 0) as avg_grid,
                       ROUND(CAST(AVG(NULLIF(r.position, 0)) AS NUMERIC), 0) as avg_finish,
                       SUM(r.points) as total_points,
                       ROUND(CAST(SUM(r.points) / CAST(COUNT(*) AS NUMERIC) AS NUMERIC), 2) as points_per_race,
                       SUM(CASE WHEN r.position < r.grid THEN 1 ELSE 0 END) as positions_gained_count
                FROM results r
                JOIN races ra ON r.race_id = ra.race_id
                WHERE r.driver_id = ?
                GROUP BY ra.year
                ORDER BY ra.year ASC
                """;
        return jdbcTemplate.queryForList(sql, id);
    }

    /**
     * Driver finishing status analysis (DNF breakdown)
     */
    @GetMapping("/{id}/status")
    public List<Map<String, Object>> getDriverFinishingStatus(@PathVariable int id) {
        String sql = """
                SELECT
                    CASE
                        WHEN s.status IN ('Finished', '+1 Lap', '+2 Laps', '+3 Laps', '+4 Laps', '+5 Laps', '+6 Laps', '+7 Laps', '+8 Laps', '+9 Laps') THEN 'Finished'
                        WHEN s.status LIKE 'Collision%' OR s.status = 'Accident' OR s.status = 'Spun off' THEN 'Accident'
                        WHEN s.status LIKE 'Engine%' OR s.status LIKE 'Gearbox%' OR s.status LIKE 'Transmission%' OR s.status LIKE 'Hydraulics%' OR s.status LIKE 'Electrical%' THEN 'Mechanical'
                        ELSE 'Other'
                    END as status_group,
                    COUNT(*) as count
                FROM results r
                JOIN status s ON r.status_id = s.status_id
                WHERE r.driver_id = ?
                GROUP BY status_group
                ORDER BY count DESC
                """;
        return jdbcTemplate.queryForList(sql, id);
    }

    /**
     * Teammate battles (Head to Head per season)
     */
    @GetMapping("/{id}/teammates")
    public List<Map<String, Object>> getTeammateBattles(@PathVariable int id) {
        String sql = """
                SELECT
                    ra.year,
                    count(distinct r1.race_id) as races_with_teammate,
                    SUM(CASE WHEN r1.position < r2.position THEN 1 ELSE 0 END) as race_ahead,
                    SUM(CASE WHEN r1.position > r2.position THEN 1 ELSE 0 END) as race_behind,
                    SUM(CASE WHEN r1.grid < r2.grid THEN 1 ELSE 0 END) as quali_ahead,
                    SUM(CASE WHEN r1.grid > r2.grid THEN 1 ELSE 0 END) as quali_behind
                FROM results r1
                JOIN results r2 ON r1.race_id = r2.race_id AND r1.constructor_id = r2.constructor_id AND r1.driver_id != r2.driver_id
                JOIN races ra ON r1.race_id = ra.race_id
                WHERE r1.driver_id = ?
                  AND r1.position IS NOT NULL AND r2.position IS NOT NULL
                  AND r1.grid IS NOT NULL AND r2.grid IS NOT NULL
                GROUP BY ra.year
                ORDER BY ra.year ASC
                """;
        return jdbcTemplate.queryForList(sql, id);
    }

    /**
     * Cumulative career trajectory
     */
    @GetMapping("/{id}/trajectory")
    public List<Map<String, Object>> getCareerTrajectory(@PathVariable int id) {
        String sql = """
                SELECT
                    ra.year,
                    MAX(ra.round) as round,
                    SUM(r.points) as season_points,
                    SUM(SUM(r.points)) OVER (ORDER BY ra.year) as cumulative_points,
                    COUNT(*) as season_races,
                    SUM(COUNT(*)) OVER (ORDER BY ra.year) as cumulative_races
                FROM results r
                JOIN races ra ON r.race_id = ra.race_id
                WHERE r.driver_id = ?
                GROUP BY ra.year
                ORDER BY ra.year ASC
                """;
        return jdbcTemplate.queryForList(sql, id);
    }

    /**
     * Finishing position distribution (Histogram)
     */
    @GetMapping("/{id}/positions")
    public List<Map<String, Object>> getFinishingPositions(@PathVariable int id) {
        String sql = """
                SELECT
                    r.position,
                    COUNT(*) as count
                FROM results r
                WHERE r.driver_id = ?
                  AND r.position IS NOT NULL
                GROUP BY r.position
                ORDER BY r.position ASC
                """;
        return jdbcTemplate.queryForList(sql, id);
    }
}
