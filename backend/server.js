//import libraries needed
const express = require("express");
const app = express();
const port = 3000; 
//common port, if there are issues, mention it on teams and it will be changed 
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.listen(port, () => {
    console.log(`Local Events backend is running on port ${port}`);
})