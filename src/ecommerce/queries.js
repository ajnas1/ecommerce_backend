const getUser = "SELECT id FROM users WHERE LOWER(username) = LOWER($1)";
const addUser = "INSERT INTO users (username, password, registered, email) VALUES ($1, $2, now(),$3)";
const checkUser = "SELECT * FROM users WHERE username = $1";
const updateLastLogin = "UPDATE users SET last_login = now() Where id = $1";
const addProduct = "INSERT INTO products (name, image, price, isStockOut) VALUES ($1, $2, $3, $4)";
const getProducts = "SELECT * FROM products";

export default { getUser, addUser, checkUser, updateLastLogin, addProduct, getProducts }