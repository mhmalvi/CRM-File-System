const express = require("express");
var bodyParser = require('body-parser');
const app = express();


const dotenv = require('dotenv');
dotenv.config()

//const port = 5000;
const port =  process.env.PORT;

const userDocumentsRouter = require("./routes/userDocuments");

app.use(express.json());

//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );
app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

// app.post('/programming-languages', function(req, res) {
//     console.log('receiving data ...');
//     console.log('body is ',req.body);
//     res.send(req.body);
// });


app.use("/api/add-documents", userDocumentsRouter);


/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});