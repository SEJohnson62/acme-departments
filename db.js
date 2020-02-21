const pg = require('pg');

const sync = async()=> {
  //DROP and RECREATE TABLES
  //remember "departmentId" will need to be in quotes
  const SQL = `
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS departments;
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp"

  CREATE TABLE departments(
    dept_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dept_name VARCHAR(100)
  )

  CREATE TABLE users(
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(100),
    dept_id UUID REFERENCES departments(dept_id)
  );
  `;
  const response = await client.query(SQL);
  return response.rows;
};

// Department Methods

const createDepartment = async(dept_name)=> {
  const SQL = 'insert into departments(dept_name) values ($1) returning *';
  const response = await client.query(SQL, [dept_name]);
  return response.rows;
};

const readDepartments = async()=> {
  const SQL = 'select * from departments';
  const response = await client.query(SQL);
  return response.rows;
};

// User Methods

const readUsers = async()=> {
  return [];
};

module.exports = {
  sync,
  readDepartments,
  readUsers
};
/*you will eventually need to export all of these

module.exports = {
  sync,
  readDepartments,
  readUsers,
  createDepartment,
  createUser,
  deleteDepartment,
  deleteUser,
  updateUser,
  updateDepartment
};
*/
