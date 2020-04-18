const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/posts', (req, res) => {
  res.status(201).json({ title: req.body.title });
});

app.get('/posts', (req, res) => {
  res.status(200).json({
    posts: [{ id: 'A0', title: 'example' }],
    total: 1,
  });
});

app.get('/posts/:id', (req, res) => {
  if (!req.params.id || req.params.id.length < 2) {
    return res.status(404).json({ code: 'NOT_FOUND' });
  }
  res.status(200).json({ id: req.params.id, title: 'example' });
});

app.post('/posts/:id/comments', (req, res) => {
  if (!req.params.id || req.params.id.length < 2) {
    return res.status(404).json({ code: 'NOT_FOUND' });
  }
  if (!req.body.text) {
    return res.status(422).json({ code: 'UNPROCESSABLE_ENTITY' });
  }
  res.status(201).json({ postId: 30, text: req.body.text });
});

app.get('/posts/:id/comments', (req, res) => {
  if (!req.params.id || req.params.id.length < 2) {
    return res.status(404).json({ code: 'NOT_FOUND' });
  }
  res.status(200).json([{ postId: 30, text: 'this is so cool' }]);
});

module.exports = app;
