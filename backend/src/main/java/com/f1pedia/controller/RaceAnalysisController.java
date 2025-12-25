package com.f1pedia.controller;

import com.f1pedia.domain.LapTime;
import com.f1pedia.domain.PitStop;
import com.f1pedia.domain.Qualifying;
import com.f1pedia.domain.Result;
import com.f1pedia.repository.LapTimeRepository;
import com.f1pedia.repository.PitStopRepository;
import com.f1pedia.repository.QualifyingRepository;
import com.f1pedia.repository.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/races")
public class RaceAnalysisController {

    @Autowired
    private LapTimeRepository lapTimeRepository;

    @Autowired
    private PitStopRepository pitStopRepository;

    @Autowired
    private QualifyingRepository qualifyingRepository;

    @GetMapping("/{raceId}/lap-times")
    public List<LapTime> getLapTimes(@PathVariable Integer raceId) {
        return lapTimeRepository.findByIdRaceIdOrderByIdLapAsc(raceId);
    }

    @GetMapping("/{raceId}/pit-stops")
    public List<PitStop> getPitStops(@PathVariable Integer raceId) {
        return pitStopRepository.findByRaceIdOrderByStopAsc(raceId);
    }

    @GetMapping("/{raceId}/qualifying")
    public List<Qualifying> getQualifying(@PathVariable Integer raceId) {
        return qualifyingRepository.findByRaceRaceIdOrderByPositionAsc(raceId);
    }

    @Autowired
    private ResultRepository resultRepository;

    @GetMapping("/{raceId}/results")
    public List<Result> getResults(@PathVariable Integer raceId) {
        return resultRepository.findByRace_RaceId(raceId);
    }
}
