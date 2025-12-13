package com.f1pedia.controller;

import com.f1pedia.repository.PitStopRepository;
import com.f1pedia.repository.QualifyingRepository;
import com.f1pedia.repository.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:5173")
public class AnalyticsController {

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private PitStopRepository pitStopRepository;

    @Autowired
    private QualifyingRepository qualifyingRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ===========================================
    // EXISTING ENDPOINTS
    // ===========================================

    @GetMapping("/dnf-causes")
    public List<Map<String, Object>> getDNFCauses() {
        List<Object[]> results = resultRepository.findDNFCauseCounts();
        return results.stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put("status", row[0]);
            map.put("count", ((Number) row[1]).intValue());
            return map;
        }).collect(Collectors.toList());
    }

    @GetMapping("/pit-stops")
    public List<Map<String, Object>> getPitStopEfficiency(
            @RequestParam(required = false) Integer season) {
        List<Object[]> results = season != null
                ? pitStopRepository.findPitStopEfficiencyBySeason(season)
                : pitStopRepository.findOverallPitStopEfficiency();

        return results.stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put("driver", row[0]);
            map.put("avgPitMs", ((Number) row[1]).doubleValue());
            map.put("avgPitSec", ((Number) row[1]).doubleValue() / 1000.0);
            return map;
        }).collect(Collectors.toList());
    }

    @GetMapping("/quali-vs-race")
    public List<Map<String, Object>> getQualiVsRace(@RequestParam Integer driverId) {
        List<Object[]> results = qualifyingRepository.findQualiVsRaceByDriver(driverId);
        return results.stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put("race", row[0]);
            map.put("qualiPos", row[1] != null ? ((Number) row[1]).intValue() : null);
            map.put("racePos", row[2] != null ? ((Number) row[2]).intValue() : null);
            map.put("delta", row[3] != null ? ((Number) row[3]).intValue() : null);
            return map;
        }).collect(Collectors.toList());
    }

    // ===========================================
    // NEW F1-TECHNICAL ANALYTICS ENDPOINTS
    // ===========================================

    /**
     * Pole position to win conversion rate by driver
     */
    @GetMapping("/pole-to-win")
    public List<Map<String, Object>> getPoleToWinConversion() {
        String sql = """
                SELECT d.forename || ' ' || d.surname as driver,
                       COUNT(*) as poles,
                       SUM(CASE WHEN r.position = 1 THEN 1 ELSE 0 END) as wins_from_pole,
                       ROUND((100.0 * SUM(CASE WHEN r.position = 1 THEN 1 ELSE 0 END) / COUNT(*))::numeric, 1) as conversion_rate
                FROM results r
                JOIN drivers d ON r.driver_id = d.driver_id
                WHERE r.grid = 1
                GROUP BY d.driver_id, d.forename, d.surname
                HAVING COUNT(*) >= 5
                ORDER BY conversion_rate DESC
                LIMIT 20
                """;
        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Grid position vs finish position analysis (overtaking stats)
     */
    @GetMapping("/grid-performance")
    public List<Map<String, Object>> getGridPerformance(@RequestParam(defaultValue = "2023") int season) {
        String sql = """
                SELECT d.forename || ' ' || d.surname as driver,
                       COUNT(*) as races,
                       ROUND(AVG(r.grid)::numeric, 2) as avg_grid,
                       ROUND(AVG(r.position)::numeric, 2) as avg_finish,
                       ROUND(AVG(r.grid - r.position)::numeric, 2) as avg_positions_gained,
                       SUM(CASE WHEN r.position < r.grid THEN 1 ELSE 0 END) as races_gained,
                       SUM(CASE WHEN r.position > r.grid THEN 1 ELSE 0 END) as races_lost
                FROM results r
                JOIN drivers d ON r.driver_id = d.driver_id
                JOIN races ra ON r.race_id = ra.race_id
                WHERE ra.year = ? AND r.position IS NOT NULL AND r.grid > 0
                GROUP BY d.driver_id, d.forename, d.surname
                HAVING COUNT(*) >= 5
                ORDER BY avg_positions_gained DESC
                """;
        return jdbcTemplate.queryForList(sql, season);
    }

    /**
     * Qualifying performance - Q1 to Q3 progression rates
     */
    @GetMapping("/qualifying-progression")
    public List<Map<String, Object>> getQualifyingProgression(@RequestParam(defaultValue = "2023") int season) {
        String sql = """
                SELECT d.forename || ' ' || d.surname as driver,
                       c.name as team,
                       COUNT(*) as sessions,
                       SUM(CASE WHEN q.q1 IS NOT NULL THEN 1 ELSE 0 END) as q1_attempts,
                       SUM(CASE WHEN q.q2 IS NOT NULL THEN 1 ELSE 0 END) as made_q2,
                       SUM(CASE WHEN q.q3 IS NOT NULL THEN 1 ELSE 0 END) as made_q3,
                       ROUND((100.0 * SUM(CASE WHEN q.q3 IS NOT NULL THEN 1 ELSE 0 END) / COUNT(*))::numeric, 1) as q3_rate,
                       COUNT(*) FILTER (WHERE q.position = 1) as poles
                FROM qualifying q
                JOIN drivers d ON q.driver_id = d.driver_id
                JOIN constructors c ON q.constructor_id = c.constructor_id
                JOIN races r ON q.race_id = r.race_id
                WHERE r.year = ?
                GROUP BY d.driver_id, d.forename, d.surname, c.name
                ORDER BY q3_rate DESC, poles DESC
                """;
        return jdbcTemplate.queryForList(sql, season);
    }

    /**
     * Fastest lap analysis - who sets them and when
     */
    @GetMapping("/fastest-laps")
    public List<Map<String, Object>> getFastestLapStats(@RequestParam(defaultValue = "2023") int season) {
        String sql = """
                SELECT d.forename || ' ' || d.surname as driver,
                       COUNT(*) as fastest_laps,
                       SUM(CASE WHEN r.position = 1 THEN 1 ELSE 0 END) as fl_with_win,
                       SUM(CASE WHEN r.position <= 3 THEN 1 ELSE 0 END) as fl_with_podium,
                       SUM(r.points) as total_points
                FROM results r
                JOIN drivers d ON r.driver_id = d.driver_id
                JOIN races ra ON r.race_id = ra.race_id
                WHERE ra.year = ? AND r.rank = 1
                GROUP BY d.driver_id, d.forename, d.surname
                ORDER BY fastest_laps DESC
                """;
        return jdbcTemplate.queryForList(sql, season);
    }

    /**
     * Circuit-specific DNF rates
     */
    @GetMapping("/circuit-reliability")
    public List<Map<String, Object>> getCircuitReliability() {
        String sql = """
                SELECT ci.name as circuit,
                       ci.country,
                       COUNT(*) as total_entries,
                       SUM(CASE WHEN s.status != 'Finished' AND s.status NOT LIKE '+%' THEN 1 ELSE 0 END) as dnfs,
                       ROUND((100.0 * SUM(CASE WHEN s.status != 'Finished' AND s.status NOT LIKE '+%' THEN 1 ELSE 0 END) / COUNT(*))::numeric, 1) as dnf_rate
                FROM results r
                JOIN races ra ON r.race_id = ra.race_id
                JOIN circuits ci ON ra.circuit_id = ci.circuit_id
                JOIN status s ON r.status_id = s.status_id
                GROUP BY ci.circuit_id, ci.name, ci.country
                HAVING COUNT(*) >= 50
                ORDER BY dnf_rate DESC
                LIMIT 20
                """;
        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Pit stop strategy analysis by circuit
     */
    @GetMapping("/pit-strategy")
    public List<Map<String, Object>> getPitStrategy(@RequestParam(required = false) Integer circuitId) {
        String sql = """
                SELECT ci.name as circuit,
                       ps.stops,
                       COUNT(*) as count,
                       ROUND((100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY ci.circuit_id))::numeric, 1) as percentage
                FROM (
                    SELECT race_id, driver_id, MAX(stop) as stops
                    FROM pit_stops
                    GROUP BY race_id, driver_id
                ) ps
                JOIN races ra ON ps.race_id = ra.race_id
                JOIN circuits ci ON ra.circuit_id = ci.circuit_id
                WHERE ra.year >= 2018
                """
                + (circuitId != null ? " AND ci.circuit_id = " + circuitId : "") + """
                        GROUP BY ci.circuit_id, ci.name, ps.stops
                        ORDER BY ci.name, ps.stops
                        """;
        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Constructor performance trends over seasons
     */
    @GetMapping("/constructor-trends")
    public List<Map<String, Object>> getConstructorTrends() {
        String sql = """
                SELECT c.name as constructor,
                       ra.year,
                       SUM(r.points) as points,
                       COUNT(CASE WHEN r.position = 1 THEN 1 END) as wins,
                       COUNT(CASE WHEN r.position <= 3 THEN 1 END) as podiums
                FROM results r
                JOIN constructors c ON r.constructor_id = c.constructor_id
                JOIN races ra ON r.race_id = ra.race_id
                WHERE ra.year >= 2014 AND c.constructor_id IN (
                    SELECT constructor_id FROM results
                    JOIN races ON results.race_id = races.race_id
                    WHERE races.year = 2023
                    GROUP BY constructor_id
                )
                GROUP BY c.constructor_id, c.name, ra.year
                ORDER BY c.name, ra.year
                """;
        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Championship battle - points progression through season
     */
    @GetMapping("/championship-battle")
    public List<Map<String, Object>> getChampionshipBattle(@RequestParam(defaultValue = "2023") int season) {
        String sql = """
                SELECT d.forename || ' ' || d.surname as driver,
                       ra.round,
                       ra.name as race,
                       ds.points,
                       ds.position,
                       ds.wins
                FROM driver_standings ds
                JOIN drivers d ON ds.driver_id = d.driver_id
                JOIN races ra ON ds.race_id = ra.race_id
                WHERE ra.year = ?
                ORDER BY d.driver_id, ra.round
                """;
        return jdbcTemplate.queryForList(sql, season);
    }

    @GetMapping("/constructor-championship")
    public List<Map<String, Object>> getConstructorChampionship(@RequestParam(defaultValue = "2023") int season) {
        String sql = """
                SELECT c.name as constructor,
                       ra.round,
                       ra.name as race,
                       cs.points,
                       cs.position,
                       cs.wins
                FROM constructor_standings cs
                JOIN constructors c ON cs.constructor_id = c.constructor_id
                JOIN races ra ON cs.race_id = ra.race_id
                WHERE ra.year = ?
                ORDER BY c.constructor_id, ra.round
                """;
        return jdbcTemplate.queryForList(sql, season);
    }

    /**
     * Teammate qualifying battle
     */
    @GetMapping("/teammate-battles")
    public List<Map<String, Object>> getTeammateBattles(@RequestParam(defaultValue = "2023") int season) {
        String sql = """
                WITH team_quali AS (
                    SELECT q.race_id, q.constructor_id, q.driver_id, q.position,
                           d.forename || ' ' || d.surname as driver
                    FROM qualifying q
                    JOIN drivers d ON q.driver_id = d.driver_id
                    JOIN races r ON q.race_id = r.race_id
                    WHERE r.year = ?
                )
                SELECT c.name as team,
                       tq1.driver as driver1,
                       tq2.driver as driver2,
                       COUNT(*) as head_to_heads,
                       SUM(CASE WHEN tq1.position < tq2.position THEN 1 ELSE 0 END) as driver1_wins,
                       SUM(CASE WHEN tq2.position < tq1.position THEN 1 ELSE 0 END) as driver2_wins
                FROM team_quali tq1
                JOIN team_quali tq2 ON tq1.race_id = tq2.race_id
                    AND tq1.constructor_id = tq2.constructor_id
                    AND tq1.driver_id < tq2.driver_id
                JOIN constructors c ON tq1.constructor_id = c.constructor_id
                GROUP BY c.constructor_id, c.name, tq1.driver, tq2.driver
                HAVING COUNT(*) >= 5
                ORDER BY c.name
                """;
        return jdbcTemplate.queryForList(sql, season);
    }

    /**
     * Points per race efficiency
     */
    @GetMapping("/points-efficiency")
    public List<Map<String, Object>> getPointsEfficiency(@RequestParam(defaultValue = "2023") int season) {
        String sql = """
                SELECT d.forename || ' ' || d.surname as driver,
                       c.name as team,
                       COUNT(*) as races,
                       SUM(r.points) as total_points,
                       ROUND(AVG(r.points)::numeric, 2) as points_per_race,
                       COUNT(CASE WHEN r.points > 0 THEN 1 END) as points_finishes,
                       ROUND((100.0 * COUNT(CASE WHEN r.points > 0 THEN 1 END) / COUNT(*))::numeric, 1) as points_rate
                FROM results r
                JOIN drivers d ON r.driver_id = d.driver_id
                JOIN constructors c ON r.constructor_id = c.constructor_id
                JOIN races ra ON r.race_id = ra.race_id
                WHERE ra.year = ?
                GROUP BY d.driver_id, d.forename, d.surname, c.name
                ORDER BY points_per_race DESC
                """;
        return jdbcTemplate.queryForList(sql, season);
    }

    // ===========================================
    // ML-INSPIRED ADVANCED ANALYTICS
    // ===========================================

    /**
     * Driver Form Analysis - Rolling performance over last N races
     * Based on ML insight: rolling_wins is 70.7% predictive of race wins
     */
    @GetMapping("/driver-form")
    public List<Map<String, Object>> getDriverForm(@RequestParam(defaultValue = "10") int lastNRaces) {
        String sql = """
                WITH recent_results AS (
                    SELECT r.driver_id,
                           d.forename || ' ' || d.surname as driver,
                           r.position,
                           r.points,
                           r.grid,
                           ra.year,
                           ra.round,
                           ROW_NUMBER() OVER (PARTITION BY r.driver_id ORDER BY ra.year DESC, ra.round DESC) as race_num
                    FROM results r
                    JOIN drivers d ON r.driver_id = d.driver_id
                    JOIN races ra ON r.race_id = ra.race_id
                    WHERE r.position IS NOT NULL
                )
                SELECT driver,
                       COUNT(*) as races_analyzed,
                       SUM(CASE WHEN position = 1 THEN 1 ELSE 0 END) as wins,
                       SUM(CASE WHEN position <= 3 THEN 1 ELSE 0 END) as podiums,
                       ROUND(AVG(position)::numeric, 2) as avg_finish,
                       ROUND(AVG(points)::numeric, 2) as avg_points,
                       ROUND(AVG(grid - position)::numeric, 2) as avg_positions_gained,
                       SUM(points) as total_points,
                       ROUND((100.0 * SUM(CASE WHEN position = 1 THEN 1 ELSE 0 END) / COUNT(*))::numeric, 1) as win_rate
                FROM recent_results
                WHERE race_num <= ?
                GROUP BY driver_id, driver
                HAVING COUNT(*) >= ?
                ORDER BY win_rate DESC, avg_finish ASC
                """;
        return jdbcTemplate.queryForList(sql, lastNRaces, lastNRaces / 2);
    }

    /**
     * Grid to Win Conversion - How often does each grid position win?
     */
    @GetMapping("/grid-win-conversion")
    public List<Map<String, Object>> getGridWinConversion() {
        String sql = """
                SELECT r.grid,
                       COUNT(*) as races,
                       SUM(CASE WHEN r.position = 1 THEN 1 ELSE 0 END) as wins,
                       ROUND((100.0 * SUM(CASE WHEN r.position = 1 THEN 1 ELSE 0 END) / COUNT(*))::numeric, 2) as win_rate,
                       SUM(CASE WHEN r.position <= 3 THEN 1 ELSE 0 END) as podiums,
                       ROUND((100.0 * SUM(CASE WHEN r.position <= 3 THEN 1 ELSE 0 END) / COUNT(*))::numeric, 2) as podium_rate
                FROM results r
                WHERE r.grid BETWEEN 1 AND 20 AND r.position IS NOT NULL
                GROUP BY r.grid
                ORDER BY r.grid
                """;
        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Driver Circuit Specialization - Which circuits favor which drivers?
     */
    @GetMapping("/driver-circuit-advantage")
    public List<Map<String, Object>> getDriverCircuitAdvantage(@RequestParam(required = false) Integer circuitId) {
        String baseSql = """
                SELECT d.forename || ' ' || d.surname as driver,
                       ci.name as circuit,
                       ci.country,
                       COUNT(*) as races,
                       SUM(CASE WHEN r.position = 1 THEN 1 ELSE 0 END) as wins,
                       SUM(CASE WHEN r.position <= 3 THEN 1 ELSE 0 END) as podiums,
                       ROUND(AVG(r.position)::numeric, 2) as avg_finish,
                       SUM(r.points) as total_points
                FROM results r
                JOIN drivers d ON r.driver_id = d.driver_id
                JOIN races ra ON r.race_id = ra.race_id
                JOIN circuits ci ON ra.circuit_id = ci.circuit_id
                WHERE r.position IS NOT NULL
                """;

        if (circuitId != null) {
            return jdbcTemplate.queryForList(baseSql +
                    " AND ci.circuit_id = ? GROUP BY d.driver_id, d.forename, d.surname, ci.circuit_id, ci.name, ci.country HAVING COUNT(*) >= 3 ORDER BY wins DESC LIMIT 50",
                    circuitId);
        }
        return jdbcTemplate.queryForList(baseSql +
                " GROUP BY d.driver_id, d.forename, d.surname, ci.circuit_id, ci.name, ci.country HAVING COUNT(*) >= 3 ORDER BY wins DESC LIMIT 50");
    }

    /**
     * Constructor Momentum - Team performance trend over seasons
     */
    @GetMapping("/constructor-momentum")
    public List<Map<String, Object>> getConstructorMomentum() {
        String sql = """
                SELECT c.name as constructor,
                       ra.year,
                       SUM(r.points) as total_points,
                       SUM(CASE WHEN r.position = 1 THEN 1 ELSE 0 END) as wins,
                       SUM(CASE WHEN r.position <= 3 THEN 1 ELSE 0 END) as podiums,
                       ROUND(AVG(r.position)::numeric, 2) as avg_finish
                FROM results r
                JOIN constructors c ON r.constructor_id = c.constructor_id
                JOIN races ra ON r.race_id = ra.race_id
                WHERE ra.year >= 2014
                GROUP BY c.constructor_id, c.name, ra.year
                HAVING SUM(r.points) > 0
                ORDER BY c.name, ra.year
                """;
        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Head-to-head historical battles between specific drivers
     */
    @GetMapping("/head-to-head")
    public List<Map<String, Object>> getHeadToHead(
            @RequestParam int driver1Id,
            @RequestParam int driver2Id) {
        String sql = """
                WITH race_results AS (
                    SELECT ra.race_id, ra.year, ra.name as race_name,
                           d.forename || ' ' || d.surname as driver,
                           r.driver_id,
                           r.position,
                           r.points
                    FROM results r
                    JOIN drivers d ON r.driver_id = d.driver_id
                    JOIN races ra ON r.race_id = ra.race_id
                    WHERE r.driver_id IN (?, ?)
                ),
                paired AS (
                    SELECT r1.race_id, r1.year, r1.race_name,
                           r1.driver as driver1, r1.position as pos1, r1.points as pts1,
                           r2.driver as driver2, r2.position as pos2, r2.points as pts2
                    FROM race_results r1
                    JOIN race_results r2 ON r1.race_id = r2.race_id AND r1.driver_id = ? AND r2.driver_id = ?
                )
                SELECT driver1, driver2,
                       COUNT(*) as shared_races,
                       SUM(CASE WHEN pos1 < pos2 THEN 1 ELSE 0 END) as driver1_ahead,
                       SUM(CASE WHEN pos2 < pos1 THEN 1 ELSE 0 END) as driver2_ahead,
                       SUM(pts1) as driver1_points,
                       SUM(pts2) as driver2_points,
                       SUM(CASE WHEN pos1 = 1 THEN 1 ELSE 0 END) as driver1_wins,
                       SUM(CASE WHEN pos2 = 1 THEN 1 ELSE 0 END) as driver2_wins
                FROM paired
                GROUP BY driver1, driver2
                """;
        return jdbcTemplate.queryForList(sql, driver1Id, driver2Id, driver1Id, driver2Id);
    }
}
