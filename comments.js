// Create web server

const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;
const mongoose = require('mongoose');
const Comment = require('./models/comment');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/comments', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// GET all comments
app.get('/api/comments', (req, res) => {
  Comment.find({}, (err, comments) => {
    if (err) {
      console.log(err);
    } else {
      res.json(comments);
    }
  });
});

// POST a new comment
app.post('/api/comments', (req, res) => {
  const comment = new Comment(req.body);
  comment.save().then(() => {
    res.json('Comment added');
  });
});

// DELETE a comment
app.delete('/api/comments/:id', (req, res) => {
  Comment.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.json('Comment deleted');
    }
  });
});

// PUT a new comment
app.put('/api/comments/:id', (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, comment) => {
      if (err) {
        console.log(err);
      } else {
        res.json(comment);
      }
    }
  );
});

// For any other requests, serve static files if in production
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Start server
app.listen(port, () => console.log(`Listening on port ${port}`));
