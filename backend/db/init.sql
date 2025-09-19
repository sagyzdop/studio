CREATE TABLE users
(
    id         INTEGER PRIMARY KEY,
    email      VARCHAR(255) UNIQUE        NOT NULL,
    password   VARCHAR(255)               NOT NULL,
    "fullName" VARCHAR(255),
    role       VARCHAR(50) DEFAULT 'user' NOT NULL
);

CREATE TABLE charts
(
    id          INTEGER PRIMARY KEY,
    "userId"    INTEGER REFERENCES users (id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    "sqlQuery"  TEXT         NOT NULL,
    "chartType" VARCHAR(50)  NOT NULl
);