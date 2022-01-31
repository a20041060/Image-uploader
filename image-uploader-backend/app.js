require('dotenv').config();
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const {GridFsStorage}= require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const cors = require('cors')

const MongoDBurl="mongodb+srv://<account>:<password>@cluster0.4agrp.mongodb.net/fileUploader?retryWrites=true&w=majority"

const app = express();

const conn = mongoose.createConnection(MongoDBurl);

let gfs;

conn.once('open',()=>{
    gfs = Grid(conn.db,mongoose.mongo)
    gfs.collection('imageUploader')
    console.log("db connected")
})

// Create a storage object with a given configuration
const storage = new GridFsStorage({
     url: MongoDBurl,
     file: (req, file) => {
        return new Promise((resolve, reject) => {
          crypto.randomBytes(16, (err, buf) => {
            if (err) {
              return reject(err);
            }
            const filename = buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
              filename: filename,
              bucketName: 'imageUploader'
            };
            resolve(fileInfo);
          });
        });
      }
    });


const upload = multer({ storage});

const port = process.env.PORT || 5000;

app.post('/upload',upload.single('file'),(req,res)=>{
  res.header("Access-Control-Allow-Origin", "*");
  // res.redirect('/');
})


app.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    // Files exist
    return res.json(files);
  });
});

app.get('/files/:filename', (req,res)=>{
  gfs.files.findOne({filename:req.params.filename},(err,file)=>{
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // File exists
    return res.json(file);
  })
})

app.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});


app.delete('/files/:id', (req, res) => {
  gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.redirect('/');
  });
});



app.use(cors());


app.get('/',(req,res)=>res.send("Yo Hello World"));

app.listen(port,
            ()=>console.log(`Listening on the port ${port}...& DB connected`))
