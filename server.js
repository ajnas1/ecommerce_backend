import express from "express";
const app = express();
import router from "./src/ecommerce/routes.js"


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api", router);
const port = 3000;

app.listen(port, () => console.log(`app listening on port ${port}`));


