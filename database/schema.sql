psql

DROP DATABASE commDev;

CREATE DATABASE commDev;

\c commdev

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title TEXT,
    content TEXT,
    community INT,
    author_id TEXT,
    posted_at TIMESTAMP,
    rating INT
); 

CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    author_id TEXT,
    is_like BOOLEAN,
    for_post BOOLEAN,
    vote_weight INT,
    target_id INT,
    submitted_at TIMESTAMP
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    author_id TEXT,
    content TEXT,
    for_post BOOLEAN,
    target_id INTEGER,
    submitted_at TIMESTAMP,
    rating INT
);

CREATE TABLE communities (
    id SERIAL PRIMARY KEY,
    owner_id TEXT,
    title TEXT,
    sidebar TEXT
);

CREATE TABLE users (
    id TEXT NOT NULL UNIQUE,
    creation_date TIMESTAMP,
    username TEXT,
    user_weight INT DEFAULT 0
);

CREATE TABLE action (
    id SERIAL PRIMARY KEY,
    date_occured TIMESTAMP,
    user_id TEXT,
    weight INT
);

CREATE TABLE follows (
    id SERIAL PRIMARY KEY,
    community_id INT,
    user_id TEXT
);