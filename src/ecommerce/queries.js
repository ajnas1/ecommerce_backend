const getUser = "SELECT id FROM users WHERE LOWER(username) = LOWER($1)";
const addUser = "INSERT INTO users (username, password, registered) VALUES ($1, $2, now())"

export default {getUser, addUser}