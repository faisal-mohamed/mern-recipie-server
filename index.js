import  express from 'express';
import  cors from 'cors';
import  mongoose from 'mongoose';
import 'dotenv/config';


const port = 5000;

const app = express();

//Importing the Routes.
import {UserRouter} from './routes/user.js';
import { RecipieRouter } from './routes/recipie.js';



app.use(express.json());
app.use(cors());

app.use("/auth", UserRouter);
app.use("/recipie", RecipieRouter);

mongoose.connect(process.env.MONGODB_URL);
   


app.listen(port, ()=> console.log(`SERVER CONNECTED AT PORT ${port}`));