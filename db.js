const { Client } = require('pg');
const client = new Client('postgres://localhost/acme_depts');
client.connect();

const sync = async()=> {
  //DROP and RECREATE TABLES
  //remember "departmentId" will need to be in quotes
  const SQL = `
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS departments;
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  CREATE TABLE departments(
    "departmentId" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dept_name VARCHAR(100)
  );

  CREATE TABLE users(
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(100),
    "departmentId" UUID REFERENCES departments("departmentId")
  );
  `;

  await client.query(SQL);
  const [HR, Engineering] = await Promise.all([
    createDepartment({ dept_name: 'HR' }),
    createDepartment({ dept_name: 'Engineering' })
  ]);

  await Promise.all([
    createUser({ user_name: 'Lucy', "departmentId": Engineering.departmentId }),
    createUser({ user_name: 'Moe', "departmentId": HR.departmentId })
  ]);
};

// Department Methods

const createDepartment = async(dept_name)=> {
  const SQL = 'insert into departments(dept_name) values ($1) returning *';
  const response = await client.query(SQL, [dept_name]);
  return response.rows[0];
};

const readDepartments = async()=> {
  const SQL = 'select * from departments';
  const response = await client.query(SQL);
  return response.rows;
};

const updateDepartment = async(department)=> {
  const SQL = 'UPDATE departments SET dept_name = $1 WHERE "departmentId" = $2 returning *';
  console.log(SQL, department);
  const response = await client.query(SQL, [ department.dept_name, department.departmentId ]);
  return response.rows;
};

const deleteDepartment = async( departmentId ) => {
  //const hasUsers = await checkForUsers(departmentId);
  const hasUsers = true;
  if ( !hasUsers ) {
    const SQL = 'DELETE FROM departments WHERE departmentId = $1';
    const response = await client.query(SQL, [ departmentId ]);
    return response.rows;
  } else {
    return 'Delete all users first.'
  }
};

// User Methods

const createUser = async({ user_name, departmentId })=> {
  const SQL = 'insert into users(user_name, "departmentId") values ($1, $2) returning *';
  const response = await client.query(SQL, [user_name, departmentId]);
  return response.rows[0];
};

const readUsers = async()=> {
  const SQL = 'select * from users';
  const response = await client.query(SQL);
  return response.rows;
};

const updateUser = async(user)=> {
  const SQL = 'UPDATE users SET user_name = $1 WHERE user_id = $2 returning *';
  console.log(SQL, user);
  const response = await client.query(SQL, [ user.user_name, user.user_id ]);
  return response.rows;
};

const deleteUser = async( user_id ) => {
  //const hasUsers = await checkForUsers(departmentId);
  const hasUsers = true;
  if ( !hasUsers ) {
    const SQL = 'DELETE FROM users WHERE user_id = $1';
    const response = await client.query(SQL, [ user_id ]);
    return response.rows;
  } else {
    return 'Delete all users first.'
  }
};

module.exports = {
  sync,
  createDepartment,
  readDepartments,
  deleteDepartment,
  updateDepartment,
  createUser,
  readUsers,
  updateUser,
  deleteUser
};
