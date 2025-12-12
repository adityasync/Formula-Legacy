-- Core Tables

CREATE TABLE IF NOT EXISTS circuits (
    circuit_id INT PRIMARY KEY,
    circuit_ref VARCHAR(255),
    name VARCHAR(255),
    location VARCHAR(255),
    country VARCHAR(255),
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    alt INT,
    url TEXT
);

CREATE TABLE IF NOT EXISTS constructors (
    constructor_id INT PRIMARY KEY,
    constructor_ref VARCHAR(255),
    name VARCHAR(255),
    nationality VARCHAR(255),
    url TEXT
);

CREATE TABLE IF NOT EXISTS drivers (
    driver_id INT PRIMARY KEY,
    driver_ref VARCHAR(255),
    number INT,
    code VARCHAR(10),
    forename VARCHAR(255),
    surname VARCHAR(255),
    dob DATE,
    nationality VARCHAR(255),
    url TEXT
);

CREATE TABLE IF NOT EXISTS seasons (
    year INT PRIMARY KEY,
    url TEXT
);

CREATE TABLE IF NOT EXISTS races (
    race_id INT PRIMARY KEY,
    year INT REFERENCES seasons(year),
    round INT,
    circuit_id INT REFERENCES circuits(circuit_id),
    name VARCHAR(255),
    date DATE,
    time TIME,
    url TEXT,
    fp1_date DATE,
    fp1_time TIME,
    fp2_date DATE,
    fp2_time TIME,
    fp3_date DATE,
    fp3_time TIME,
    quali_date DATE,
    quali_time TIME,
    sprint_date DATE,
    sprint_time TIME
);

CREATE TABLE IF NOT EXISTS status (
    status_id INT PRIMARY KEY,
    status VARCHAR(255)
);

-- Performance Tables

CREATE TABLE IF NOT EXISTS results (
    result_id INT PRIMARY KEY,
    race_id INT REFERENCES races(race_id),
    driver_id INT REFERENCES drivers(driver_id),
    constructor_id INT REFERENCES constructors(constructor_id),
    number INT,
    grid INT,
    position INT,
    position_text VARCHAR(255),
    position_order INT,
    points DOUBLE PRECISION,
    laps INT,
    time VARCHAR(255),
    milliseconds INT,
    fastest_lap INT,
    rank INT,
    fastest_lap_time VARCHAR(255),
    fastest_lap_speed VARCHAR(255),
    status_id INT REFERENCES status(status_id)
);

CREATE TABLE IF NOT EXISTS sprint_results (
    result_id INT PRIMARY KEY,
    race_id INT REFERENCES races(race_id),
    driver_id INT REFERENCES drivers(driver_id),
    constructor_id INT REFERENCES constructors(constructor_id),
    number INT,
    grid INT,
    position INT,
    position_text VARCHAR(255),
    position_order INT,
    points DOUBLE PRECISION,
    laps INT,
    time VARCHAR(255),
    milliseconds INT,
    fastest_lap INT,
    fastest_lap_time VARCHAR(255),
    status_id INT REFERENCES status(status_id)
);

CREATE TABLE IF NOT EXISTS qualifying (
    qualify_id INT PRIMARY KEY,
    race_id INT REFERENCES races(race_id),
    driver_id INT REFERENCES drivers(driver_id),
    constructor_id INT REFERENCES constructors(constructor_id),
    number INT,
    position INT,
    q1 VARCHAR(255),
    q2 VARCHAR(255),
    q3 VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS pit_stops (
    race_id INT REFERENCES races(race_id),
    driver_id INT REFERENCES drivers(driver_id),
    stop INT,
    lap INT,
    time TIME,
    duration VARCHAR(255),
    milliseconds INT,
    PRIMARY KEY (race_id, driver_id, stop)
);

CREATE TABLE IF NOT EXISTS lap_times (
    race_id INT REFERENCES races(race_id),
    driver_id INT REFERENCES drivers(driver_id),
    lap INT,
    position INT,
    time VARCHAR(255),
    milliseconds INT,
    PRIMARY KEY (race_id, driver_id, lap)
);

CREATE TABLE IF NOT EXISTS driver_standings (
    driver_standings_id INT PRIMARY KEY,
    race_id INT REFERENCES races(race_id),
    driver_id INT REFERENCES drivers(driver_id),
    points DOUBLE PRECISION,
    position INT,
    position_text VARCHAR(255),
    wins INT
);

CREATE TABLE IF NOT EXISTS constructor_standings (
    constructor_standings_id INT PRIMARY KEY,
    race_id INT REFERENCES races(race_id),
    constructor_id INT REFERENCES constructors(constructor_id),
    points DOUBLE PRECISION,
    position INT,
    position_text VARCHAR(255),
    wins INT
);

CREATE TABLE IF NOT EXISTS constructor_results (
    constructor_results_id INT PRIMARY KEY,
    race_id INT REFERENCES races(race_id),
    constructor_id INT REFERENCES constructors(constructor_id),
    points DOUBLE PRECISION,
    status VARCHAR(255)
);
