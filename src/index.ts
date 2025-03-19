import express from "express";
import router from "./routes/api";

const app = express();

const PORT = 3000;

//middleware
app.use('/api', router)

app.listen(PORT, ()=>{
    console.log(`Server is running on https://localhost:${PORT}`);
})