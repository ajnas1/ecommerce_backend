import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'ajnascv1234',
    database: 'ecommerce',
    port: 5432
});

pool.connect();

export default pool;