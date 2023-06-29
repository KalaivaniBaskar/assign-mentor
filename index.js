console.log("Assign mentor to student");
import express from "express"
import dotenv from "dotenv";
import cors from "cors";
import { studentRouter } from "./Routes/students.js";

dotenv.config();
const PORT = process.env.PORT;
const app = express(); 

// db connection:
// dbConnection();

app.use(express.json());
app.use(cors());
//application middleware 
// now /student will be base route 
app.use("/app", studentRouter); 

app.get("/", (req,res)=> {
    res.send({msg:"connection working pretty good"});
})

app.listen(PORT,()=>console.log(`Server started at localhost:${PORT}`))