-- Drop existing tables in reverse order of dependencies
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS workshop_participants;
DROP TABLE IF EXISTS workshops;
DROP TABLE IF EXISTS participants;

-- Create tables in order of dependencies
CREATE TABLE participants (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    type TEXT NOT NULL CHECK(type IN ('student', 'instructor')),
    ra TEXT CHECK(length(ra) = 7),
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    cpf TEXT NOT NULL UNIQUE
);

CREATE TABLE workshops (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    instructor_id INTEGER NOT NULL,
    schedule TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'finished')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES participants(id)
);

CREATE TABLE workshop_participants (
    workshop_id INTEGER NOT NULL,
    participant_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (workshop_id, participant_id),
    FOREIGN KEY (workshop_id) REFERENCES workshops(id),
    FOREIGN KEY (participant_id) REFERENCES participants(id)
);

CREATE TABLE attendance (
    id INTEGER PRIMARY KEY,
    workshop_id INTEGER NOT NULL,
    participant_id INTEGER NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('present', 'absent')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workshop_id) REFERENCES workshops(id),
    FOREIGN KEY (participant_id) REFERENCES participants(id)
);
