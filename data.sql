CREATE TABLE users (
    id text PRIMARY KEY,
    username text NOT NULL,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    join_at timestamp without time zone NOT NULL
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
)