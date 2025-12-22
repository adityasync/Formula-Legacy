package com.f1pedia.controller;

import com.f1pedia.domain.Constructor;
import com.f1pedia.repository.ConstructorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/constructors")
public class ConstructorController {

    @Autowired
    private ConstructorRepository constructorRepository;

    @GetMapping
    public List<Constructor> getAllConstructors(@RequestParam(required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return constructorRepository.findByNameContainingIgnoreCase(search);
        }
        return constructorRepository.findAll();
    }

    @GetMapping("/stats")
    public List<com.f1pedia.dto.ConstructorStatsDTO> getConstructorsWithStats() {
        return constructorRepository.findAllWithStats();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Constructor> getConstructorById(@PathVariable int id) {
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
        List<Object[]> results = resultRepository.findDriverStatsByConstructorId(id);

        return results.stream().map(row -> {
            com.f1pedia.domain.Driver driver = (com.f1pedia.domain.Driver) row[0];
            long wins = ((Number) row[1]).longValue();
            double totalPoints = ((Number) row[2]).doubleValue();
            long races = ((Number) row[3]).longValue();
            int firstYear = ((Number) row[4]).intValue();
            int lastYear = ((Number) row[5]).intValue();
            long podiums = ((Number) row[6]).longValue();

            java.util.Map<String, Object> stats = new java.util.HashMap<>();
            stats.put("driverId", driver.getDriverId());
            stats.put("forename", driver.getForename());
            stats.put("surname", driver.getSurname());
            stats.put("code", driver.getCode());
            stats.put("number", driver.getNumber());
            stats.put("nationality", driver.getNationality());
            stats.put("totalPoints", totalPoints);
            stats.put("wins", wins);
            stats.put("podiums", podiums);
            stats.put("races", races);
            stats.put("firstYear", firstYear);
            stats.put("lastYear", lastYear);
            stats.put("yearsActive", firstYear == lastYear ? String.valueOf(firstYear) : firstYear + "-" + lastYear);

            return stats;
        }).sorted((a, b) -> Double.compare((Double) b.get("totalPoints"), (Double) a.get("totalPoints")))
                .toList();
    }

    @GetMapping("/{id}/seasons")
    public List<java.util.Map<String, Object>> getConstructorSeasons(@PathVariable Integer id) {
        List<Object[]> results = resultRepository.findConstructorSeasonStats(id);
        List<Object[]> driverPointsRaw = resultRepository.findSeasonDriverPoints(id);

        // Map driver points by year
        java.util.Map<Integer, java.util.Map<String, Double>> driverPointsByYear = new java.util.HashMap<>();
        for (Object[] row : driverPointsRaw) {
            int year = ((Number) row[0]).intValue();
            String driver = (String) row[1];
            double points = ((Number) row[2]).doubleValue();

            driverPointsByYear.computeIfAbsent(year, k -> new java.util.HashMap<>()).put(driver, points);
        }

        return results.stream().map(row -> {
            int year = ((Number) row[0]).intValue();
            double points = ((Number) row[1]).doubleValue();
            long wins = ((Number) row[2]).longValue();
            long podiums = ((Number) row[3]).longValue();
            long races = ((Number) row[4]).longValue();
            int bestFinish = row[5] != null ? ((Number) row[5]).intValue() : 0;
            double avgGrid = row[6] != null ? ((Number) row[6]).doubleValue() : 0.0;
            long dnfs = ((Number) row[7]).longValue();

            java.util.Map<String, Object> stats = new java.util.HashMap<>();
            stats.put("year", year);
            stats.put("points", points);
            stats.put("wins", wins);
            stats.put("podiums", podiums);
            stats.put("races", races);
            stats.put("bestFinish", bestFinish == 0 ? "N/A" : bestFinish);
            stats.put("avgGrid", Math.round(avgGrid * 10.0) / 10.0);
            stats.put("dnfs", dnfs);

            // Add driver points for stacked bar chart
            stats.put("driverPoints", driverPointsByYear.getOrDefault(year, new java.util.HashMap<>()));

            return stats;
        }).collect(java.util.stream.Collectors.toList());
    }

    @GetMapping("/{id}/circuits")
    public List<java.util.Map<String, Object>> getConstructorCircuits(@PathVariable Integer id) {
        List<Object[]> results = resultRepository.findConstructorCircuitStats(id);

        return results.stream().map(row -> {
            Integer circuitId = (Integer) row[0];
            String name = (String) row[1];
            String location = (String) row[2];
            String country = (String) row[3];
            long count = ((Number) row[4]).longValue();
            double points = ((Number) row[5]).doubleValue();
            long wins = ((Number) row[6]).longValue();
            long podiums = ((Number) row[7]).longValue();
            int firstYear = columnToInt(row[8]);
            int lastYear = columnToInt(row[9]);

            int bestFinish = row[10] != null ? ((Number) row[10]).intValue() : 0;
            double avgGrid = row[11] != null ? ((Number) row[11]).doubleValue() : 0.0;
            double avgFinish = row[12] != null ? ((Number) row[12]).doubleValue() : 0.0;
            long dnfs = ((Number) row[13]).longValue();

            java.util.Map<String, Object> stats = new java.util.HashMap<>();
            stats.put("circuitId", circuitId);
            stats.put("circuit", name); // Frontend expects 'circuit', not 'name'
            stats.put("name", name);
            stats.put("location", location);
            stats.put("country", country);
            stats.put("races", count);
            stats.put("points", points);
            stats.put("wins", wins);
            stats.put("podiums", podiums);
            stats.put("firstYear", firstYear);
            stats.put("lastYear", lastYear);

            stats.put("bestFinish", bestFinish == 0 ? "N/A" : bestFinish);
            stats.put("avgGrid", Math.round(avgGrid * 10.0) / 10.0);
            stats.put("avgFinish", Math.round(avgFinish * 10.0) / 10.0);
            stats.put("totalPoints", points); // Frontend uses 'totalPoints' in some charts
            stats.put("dnfs", dnfs);

            return stats;
        }).collect(java.util.stream.Collectors.toList());
    }

    private int columnToInt(Object col) {
        if (col == null)
            return 0;
        return ((Number) col).intValue();
    }

    @GetMapping("/{id}/dashboard-stats")
    public java.util.Map<String, Object> getConstructorDashboardStats(@PathVariable Integer id) {
        List<com.f1pedia.domain.Result> results = resultRepository.findByConstructorConstructorId(id);

        long poles = results.stream()
                .filter(r -> r.getGrid() != null && r.getGrid() == 1)
                .count();

        long fastestLaps = results.stream()
                .filter(r -> r.getRank() != null && r.getRank() == 1)
                .count();

        // Mutually Exclusive Distribution
        long wins = results.stream().filter(r -> r.getPositionOrder() == 1).count();
        long podiums = results.stream().filter(r -> r.getPositionOrder() > 1 && r.getPositionOrder() <= 3).count();
        long points = results.stream()
                .filter(r -> r.getPositionOrder() > 3 && r.getPoints() != null && r.getPoints() > 0).count();
        long dnfs = results.stream().filter(r -> r.getPosition() == null).count(); // Simplified DNF check
        long other = results.size() - wins - podiums - points - dnfs; // The rest (finished out of points or other
                                                                      // issues)

        // Ensure no negative (just in case of data oddities)
        if (other < 0)
            other = 0;

        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalPoles", poles);
        stats.put("totalFastestLaps", fastestLaps);

        List<java.util.Map<String, Object>> distribution = new java.util.ArrayList<>();
        if (wins > 0)
            distribution.add(java.util.Map.of("name", "Wins", "value", wins, "color", "#FFD700")); // Gold
        if (podiums > 0)
            distribution.add(java.util.Map.of("name", "Podiums", "value", podiums, "color", "#C0C0C0")); // Silver/Grey
        if (points > 0)
            distribution.add(java.util.Map.of("name", "Points", "value", points, "color", "#E10600")); // F1 Red
        if (other > 0)
            distribution.add(java.util.Map.of("name", "No Points", "value", other, "color", "#333333")); // Dark Grey
        if (dnfs > 0)
            distribution.add(java.util.Map.of("name", "DNF", "value", dnfs, "color", "#151515")); // Almost Black

        stats.put("resultDistribution", distribution);

        return stats;
    }

    @GetMapping("/{id}/status-breakdown")
    public List<java.util.Map<String, Object>> getConstructorStatusBreakdown(@PathVariable Integer id) {
        List<com.f1pedia.domain.Result> results = resultRepository.findByConstructorConstructorId(id);

        java.util.Map<String, Long> statusCounts = results.stream()
                .filter(r -> r.getStatus() != null)
                .collect(java.util.stream.Collectors.groupingBy(
                        r -> r.getStatus().getStatus(),
                        java.util.stream.Collectors.counting()));

        return statusCounts.entrySet().stream()
                .map(entry -> {
                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("status", entry.getKey());
                    map.put("count", entry.getValue());
                    // Simplified categorization logic
                    String category = "Other";
                    String status = entry.getKey().toLowerCase();
                    if (status.contains("finished") || status.contains("laps") || status.equals("+1 lap"))
                        category = "Finished";
                    else if (status.contains("accident") || status.contains("collision") || status.contains("spun"))
                        category = "Accident";
                    else if (status.contains("engine") || status.contains("gearbox") || status.contains("transmission")
                            || status.contains("hydraulics") || status.contains("electrical")
                            || status.contains("brakes"))
                        category = "Mechanical";
                    else if (status.contains("disqualified"))
                        category = "DSQ";

                    map.put("category", category);
                    return map;
                })
                .sorted((a, b) -> Long.compare((Long) b.get("count"), (Long) a.get("count")))
                .toList();
    }

    @GetMapping("/{id}/points-heatmap")
    public List<java.util.Map<String, Object>> getConstructorPointsHeatmap(@PathVariable Integer id) {
        List<com.f1pedia.domain.Result> results = resultRepository.findByConstructorConstructorId(id);

        // Group by Year and Round -> Sum Points
        // Removed unused pointsMap variable - Fixed Lint Warning
        results.stream()
                .filter(r -> r.getRace() != null)
                .collect(java.util.stream.Collectors.groupingBy(
                        r -> r.getRace().getYear() + "-" + r.getRace().getRound(), // Key: "2008-1"
                        java.util.stream.Collectors.summingDouble(r -> r.getPoints() != null ? r.getPoints() : 0.0)));

        // We need race details for tooltip (Circuit/Grand Prix Name)
        // Grouping by Race ID first is safer
        java.util.Map<Integer, List<com.f1pedia.domain.Result>> byRace = results.stream()
                .filter(r -> r.getRace() != null)
                .collect(java.util.stream.Collectors.groupingBy(r -> r.getRace().getRaceId()));

        return byRace.values().stream()
                .map(raceResults -> {
                    com.f1pedia.domain.Race race = raceResults.get(0).getRace();
                    double totalPoints = raceResults.stream()
                            .mapToDouble(r -> r.getPoints() != null ? r.getPoints() : 0.0)
                            .sum();

                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("year", race.getYear());
                    map.put("round", race.getRound());
                    map.put("raceName", race.getName());
                    map.put("points", totalPoints);
                    // Add best position for coloring if 0 points (e.g. near miss vs DNF)
                    int bestPos = raceResults.stream()
                            .filter(r -> r.getPositionOrder() != null)
                            .mapToInt(com.f1pedia.domain.Result::getPositionOrder)
                            .min().orElse(99);
                    map.put("bestPos", bestPos);

                    return map;
                })
                .sorted(java.util.Comparator.comparingInt((java.util.Map<String, Object> m) -> (Integer) m.get("year"))
                        .thenComparingInt(m -> (Integer) m.get("round")))
                .toList();
    }

    @GetMapping("/{id}/geo-performance")
    public List<java.util.Map<String, Object>> getConstructorGeoPerformance(@PathVariable Integer id) {
        List<com.f1pedia.domain.Result> results = resultRepository.findByConstructorConstructorId(id);

        // Group by Country
        java.util.Map<String, List<com.f1pedia.domain.Result>> byCountry = results.stream()
                .filter(r -> r.getRace() != null && r.getRace().getCircuit() != null
                        && r.getRace().getCircuit().getCountry() != null)
                .collect(java.util.stream.Collectors.groupingBy(r -> r.getRace().getCircuit().getCountry()));

        return byCountry.entrySet().stream()
                .map(entry -> {
                    String country = entry.getKey();
                    List<com.f1pedia.domain.Result> countryResults = entry.getValue();

                    double totalPoints = countryResults.stream()
                            .mapToDouble(r -> r.getPoints() != null ? r.getPoints() : 0.0)
                            .sum();

                    long races = countryResults.stream()
                            .map(r -> r.getRace().getRaceId())
                            .distinct()
                            .count();

                    double avgPoints = races > 0 ? totalPoints / races : 0;

                    long wins = countryResults.stream()
                            .filter(r -> r.getPosition() != null && r.getPosition() == 1)
                            .count();

                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("country", country);
                    map.put("avgPoints", Math.round(avgPoints * 100.0) / 100.0);
                    map.put("totalPoints", totalPoints);
                    map.put("races", races);
                    map.put("wins", wins);

                    return map;
                })
                .sorted((a, b) -> Double.compare((Double) b.get("avgPoints"), (Double) a.get("avgPoints")))
                .limit(10) // Top 10 to keep chart clean
                .toList();
    }
}
