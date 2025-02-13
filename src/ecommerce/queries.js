const getUser = "SELECT id FROM users WHERE LOWER(username) = LOWER($1)";
const addUser = "INSERT INTO users (username, password, registered, email) VALUES ($1, $2, now(),$3)";
const checkUser = "SELECT * FROM users WHERE username = $1";
const updateLastLogin = "UPDATE users SET last_login = now() Where id = $1";
const addProduct = "INSERT INTO products (name, image, price, isStockOut, category) VALUES ($1, $2, $3, $4, $5)";
const getProducts = "SELECT * FROM products";
const addOTP = "INSERT INTO otp (email, otp, createdat) VAlUES($1, $2, NOW())";
const checkEmailExists = "SELECT * FROM  users WHERE email = $1";
const checkOTPExists = "SELECT * FROM otp WHERE email = $1 AND otp = $2";
const deleteOTP = "DELETE FROM otp WHERE LOWER(email) = LOWER($1) AND otp = $2";
const updatePassword = "UPDATE users SET password = $1 Where LOWER(email) = LOWER($2)";

export default { getUser, addUser, checkUser, updateLastLogin, addProduct, getProducts,  addOTP, checkEmailExists, checkOTPExists, deleteOTP, updatePassword}