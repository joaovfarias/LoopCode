-- Initial schema for LoopCode application

-- Users table (username is the PK)
CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    daily_streak INTEGER NOT NULL DEFAULT 0,
    role VARCHAR(255) NOT NULL DEFAULT 'USER'
);

CREATE TABLE challenge_resolution (
    daily_challenge_id BIGSERIAL PRIMARY KEY,
    ID UUID NOT NULL,
    Resolved_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    username VARCHAR(255) NOT NULL REFERENCES users(username) ON DELETE CASCADE
);

-- Programming languages
CREATE TABLE programming_languages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    api_identifier VARCHAR(50) NOT NULL UNIQUE
);

-- Exercises (UUID PK)
CREATE TABLE exercises (
    id UUID PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    programming_lang_id BIGINT NOT NULL REFERENCES programming_languages(id) ON DELETE RESTRICT,
    difficulty VARCHAR(50) NOT NULL,
    description TEXT,
    main_code TEXT,
    creator_id VARCHAR(255) NOT NULL REFERENCES users(username) ON DELETE RESTRICT,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

-- Test cases
CREATE TABLE test_cases (
    id BIGSERIAL PRIMARY KEY,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    input_data TEXT,
    expected_output TEXT NOT NULL
);

-- Votes
CREATE TABLE votes (
    id BIGSERIAL PRIMARY KEY,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    user_username VARCHAR(255) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    voto_value INTEGER NOT NULL,
    CONSTRAINT votes_exercise_user_unique UNIQUE (exercise_id, user_username)
);

-- User lists
CREATE TABLE user_lists (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
    username VARCHAR(255) NOT NULL REFERENCES users(username) ON DELETE CASCADE
);

-- Many-to-many join table for user lists and exercises
CREATE TABLE user_list_exercises (
    list_id BIGINT NOT NULL REFERENCES user_lists(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    PRIMARY KEY (list_id, exercise_id)
);

-- Solved exercises
CREATE TABLE solved_exercises (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE
);

-- Timeout records
CREATE TABLE timeout_records (
    id BIGSERIAL PRIMARY KEY,
    timed_out_user_username VARCHAR(255) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    admin_username VARCHAR(255) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    reason VARCHAR(500) NOT NULL,
    timeout_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Ban records
CREATE TABLE ban_records (
    id BIGSERIAL PRIMARY KEY,
    banned_user_username VARCHAR(255) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    admin_username VARCHAR(255) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    ban_reason VARCHAR(500) NOT NULL,
    ban_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    unban_date TIMESTAMP WITHOUT TIME ZONE,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE daily_challenges (
    id BIGSERIAL PRIMARY KEY,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    challenge_date DATE NOT NULL UNIQUE
);