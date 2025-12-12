package com.f1pedia.controller;

import com.f1pedia.domain.Race;
import com.f1pedia.repository.RaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/races")
@CrossOrigin(origins = "http://localhost:5173")
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
}
