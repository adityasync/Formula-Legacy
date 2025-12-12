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

    @GetMapping("/{id}/drivers")
    public List<com.f1pedia.domain.Driver> getDriversByConstructor(@PathVariable Integer id) {
        return driverRepository.findDriversByConstructorId(id);
    }
}
