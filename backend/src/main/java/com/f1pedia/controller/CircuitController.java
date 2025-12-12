package com.f1pedia.controller;

import com.f1pedia.domain.Circuit;
import com.f1pedia.repository.CircuitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/circuits")
@CrossOrigin(origins = "http://localhost:5173")
public class CircuitController {

        @Autowired
        private CircuitRepository circuitRepository;

        @Autowired
        private JdbcTemplate jdbcTemplate;

        @GetMapping
        public List<Circuit> getAllCircuits() {
                return circuitRepository.findAll();
        }

        @GetMapping("/{id}")
        public ResponseEntity<Circuit> getCircuitById(@PathVariable int id) {
                return circuitRepository.findById(id)
                                .map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
        }

        /**
         * Circuit historical stats
         */
        @GetMapping("/{id}/stats")
        public ResponseEntity<Map<String, Object>> getCircuitStats(@PathVariable int id) {
                Optional<Circuit> circuitOpt = circuitRepository.findById(id);
                if (circuitOpt.isEmpty()) {
                        return ResponseEntity.notFound().build();
                }

                Circuit circuit = circuitOpt.get();
                Map<String, Object> stats = new HashMap<>();

                // Basic info
                stats.put("circuitId", circuit.getCircuitId());
                stats.put("name", circuit.getName());
                stats.put("location", circuit.getLocation());
                stats.put("country", circuit.getCountry());
                stats.put("lat", circuit.getLat());
                stats.put("lng", circuit.getLng());
                stats.put("url", circuit.getUrl());

                // Race count and years
                String overviewSql = """
                                SELECT COUNT(*) as total_races,
                                       MIN(ra.year) as first_race,
                                       MAX(ra.year) as last_race
                                FROM races ra
                                WHERE ra.circuit_id = ?
                                """;
                stats.putAll(jdbcTemplate.queryForMap(overviewSql, id));

                // Most wins at this circuit
                String winnersSql = """
                                SELECT d.forename || ' ' || d.surname as driver,
                                       d.driver_id,
                                       COUNT(*) as wins
                                FROM results r
                                JOIN races ra ON r.race_id = ra.race_id
                                JOIN drivers d ON r.driver_id = d.driver_id
                                WHERE ra.circuit_id = ? AND r.position = 1
                                GROUP BY d.driver_id, d.forename, d.surname
                                ORDER BY wins DESC
                                LIMIT 10
                                """;
                stats.put("topWinners", jdbcTemplate.queryForList(winnersSql, id));

                // Most wins by constructor
                String constructorWinsSql = """
                                SELECT c.name as constructor,
                                       c.constructor_id,
                                       COUNT(*) as wins
                                FROM results r
                                JOIN races ra ON r.race_id = ra.race_id
                                JOIN constructors c ON r.constructor_id = c.constructor_id
                                WHERE ra.circuit_id = ? AND r.position = 1
                                GROUP BY c.constructor_id, c.name
                                ORDER BY wins DESC
                                LIMIT 10
                                """;
                stats.put("topConstructors", jdbcTemplate.queryForList(constructorWinsSql, id));

                // Fastest laps
                String fastestLapsSql = """
                                SELECT d.forename || ' ' || d.surname as driver,
                                       ra.year,
                                       r.fastest_lap_time,
                                       r.fastest_lap_speed
                                FROM results r
                                JOIN races ra ON r.race_id = ra.race_id
                                JOIN drivers d ON r.driver_id = d.driver_id
                                WHERE ra.circuit_id = ? AND r.fastest_lap_time IS NOT NULL
                                ORDER BY r.fastest_lap_time ASC
                                LIMIT 10
                                """;
                stats.put("fastestLaps", jdbcTemplate.queryForList(fastestLapsSql, id));

                // DNF rate
                String dnfSql = """
                                SELECT ROUND(100.0 * SUM(CASE WHEN s.status != 'Finished' AND s.status NOT LIKE '+%' THEN 1 ELSE 0 END) / COUNT(*), 1) as dnf_rate
                                FROM results r
                                JOIN races ra ON r.race_id = ra.race_id
                                JOIN status s ON r.status_id = s.status_id
                                WHERE ra.circuit_id = ?
                                """;
                stats.put("dnfRate", jdbcTemplate.queryForMap(dnfSql, id).get("dnf_rate"));

                // Recent races
                String recentSql = """
                                SELECT ra.year, ra.name, ra.date,
                                       d.forename || ' ' || d.surname as winner,
                                       c.name as team
                                FROM races ra
                                JOIN results r ON ra.race_id = r.race_id AND r.position = 1
                                JOIN drivers d ON r.driver_id = d.driver_id
                                JOIN constructors c ON r.constructor_id = c.constructor_id
                                WHERE ra.circuit_id = ?
                                ORDER BY ra.year DESC
                                LIMIT 10
                                """;
                stats.put("recentRaces", jdbcTemplate.queryForList(recentSql, id));

                return ResponseEntity.ok(stats);
        }

        /**
         * All circuits with basic stats
         */
        @GetMapping("/with-stats")
        public List<Map<String, Object>> getCircuitsWithStats() {
                String sql = """
                                SELECT ci.circuit_id, ci.name, ci.location, ci.country,
                                       COUNT(DISTINCT ra.race_id) as total_races,
                                       MIN(ra.year) as first_race,
                                       MAX(ra.year) as last_race
                                FROM circuits ci
                                LEFT JOIN races ra ON ci.circuit_id = ra.circuit_id
                                GROUP BY ci.circuit_id, ci.name, ci.location, ci.country
                                ORDER BY total_races DESC
                                """;
                return jdbcTemplate.queryForList(sql);
        }
}
