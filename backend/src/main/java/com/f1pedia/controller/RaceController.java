package com.f1pedia.controller;

import com.f1pedia.domain.Race;
import com.f1pedia.repository.RaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/races")
public class RaceController {

    @Autowired
    private RaceRepository raceRepository;

    @GetMapping
    public List<Race> getAllRaces() {
        return raceRepository.findAll();
    }

    @GetMapping("/season/{year}")
    public List<Race> getRacesBySeason(@PathVariable Integer year) {
        return raceRepository.findByYear(year);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Race> getRaceById(@PathVariable int id) {
        return raceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get the latest season year from the database.
     * Used by frontend to default to current season instead of hardcoded values.
     */
    @GetMapping("/latest-season")
    public Integer getLatestSeason() {
        return raceRepository.findAll().stream()
                .map(Race::getYear)
                .max(Integer::compareTo)
                .orElse(java.time.Year.now().getValue());
    }
}
