import express from 'express';
import { connectToDB } from './db';
import { initPassport } from './passport';
import { initServices } from './services/services';
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();
const router = express.Router();

const port = 3000;
app.get('/', (req, res) => {
    res.send("Hello");
});

// Init middlewares
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Init passport
initPassport(app);

// Init service
initServices(router);
app.use("/data", router);

// Connect DB
connectToDB();

app.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    
    return console.log(`Server is listening on ${port}`);
});