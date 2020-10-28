DROP DATABASE IF EXISTS employees_db;

-- Create the database employees_db and specified it for use.
CREATE DATABASE employees_db;

USE employees_db;

-- Create the table departments.
CREATE TABLE departments (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dept_name VARCHAR(30) NOT NULL
);
-- Create the table role.
CREATE TABLE roles (
   id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INTEGER, 
  CONSTRAINT fk_departments 
  FOREIGN KEY(department_id) 
  REFERENCES departments(id)
);
-- Create the table employees.
CREATE TABLE employees (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER NULL, 
  CONSTRAINT fk_role 
  FOREIGN KEY(role_id)
  REFERENCES roles(id),
  CONSTRAINT fk_manager
  FOREIGN KEY(manager_id)
  REFERENCES employees(id)
);