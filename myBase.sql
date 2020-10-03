CREATE TABLE jobs (
    id integer PRIMARY KEY,
    name text NOT NULL
);

INSERT INTO jobs (name) VALUES
    ('Решение уравнения Пуассона'),
    ('Метод частиц'),
    ('Задача номер 3');

CREATE TABLE users (
    id integer PRIMARY KEY,
    surname text NOT NULL,
    first_name text NOT NULL,
    second_name text,
    birthdate text,
    gender text,
    login text NOT NULL UNIQUE,
    password text NOT NULL,
    email text NOT NULL UNIQUE
);

INSERT INTO users (surname, first_name, second_name, birthdate, gender, login, password, email) VALUES
    ('Иванов', 'Иван', 'Иванович', '10.03.1997', 'м', 'username', 'qwerty', 'username@users.ru'),
    ('Сидорова', 'Мария', null, null, null, 'user1', 'qwerty123', 'user1@users.ru');

CREATE TABLE systems (
    id integer PRIMARY KEY,
    name text NOT NULL
);

INSERT INTO systems (name) VALUES
    ('кластер'),
    ('локальная машина');

CREATE TABLE runningTasks (
    id integer PRIMARY KEY,
    name text NOT NULL,
    status text NOT NULL
);

INSERT INTO runningTasks (name, status) VALUES
    ('запуск номер 1', 'ready'),
    ('запуск номер 2', 'error'),
    ('запуск номер 3', 'not ready');
