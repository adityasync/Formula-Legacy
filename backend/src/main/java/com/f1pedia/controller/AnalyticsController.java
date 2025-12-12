package com.f1pedia.controller;

import com.f1pedia.repository.PitStopRepository;
import com.f1pedia.repository.QualifyingRepository;
import com.f1pedia.repository.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    /**
     * GET /api/analytics/dnf-causes
     * Returns DNF causes by count (excludes 'Finished' and lap-related statuses)
     */
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

    /**
     * GET /api/analytics/pit-stops?season=2023
     * Returns pit stop efficiency ranking by average pit time
     */
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

    /**
     * GET /api/analytics/quali-vs-race?driverId=1
     * Returns qualifying vs race position delta for a driver
     */
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
}
