CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL UNIQUE,
    photo_url text,
    is_admin boolean NOT NULL DEFAULT FALSE
);
CREATE TABLE companies (
    handle text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    num_employees int,
    description text,
    logo_url text
);
CREATE TABLE jobs(
    id SERIAL PRIMARY key,
    title text NOT NULL,
    salary float NOT NULL,
    equity float CHECK (equity <= 1) NOT NULL,
    company_handle text REFERENCES companies(handle) ON DELETE CASCADE,
    date_posted TIMESTAMPTZ NOT NULL DEFAULT NOW()
);