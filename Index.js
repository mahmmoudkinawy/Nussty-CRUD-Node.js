const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

const baseApiRoute = "/api";

const movies = [
  { id: 1, name: "Anaconda" },
  { id: 2, name: "Jems Bond" },
  { id: 3, name: "Rambo" },
];

app.get(`${baseApiRoute}/movies`, (req, res) => {
  res.status(200).send(movies);
});

app.get(`${baseApiRoute}/movies/:id`, (req, res) => {
  const movie = movies.find((m) => m.id === +req.params.id);
  if (!movie)
    return res.status(404).send("The Movie with the given Id was not found");

  res.status(200).send(movie);
});

app.post(`${baseApiRoute}/movies`, (req, res) => {
  const movie = {
    id: movies.length + 1,
    name: req.body.name,
  };

  const { error } = validateJoi(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  movies.push(movie);
  res.status(200).send(movie);
});

app.put(`${baseApiRoute}/movies/:id`, (req, res) => {
  const movie = movies.find((m) => m.id === +req.params.id);
  if (!movie) return res.status(404).send("The film not found");

  const { error } = validateJoi(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  movie.name = req.body.name;

  res.send(movie);
});

function validateJoi(movie) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(movie, schema);
}

app.delete(`${baseApiRoute}/movies/:id`, (req, res) => {
  const movie = movies.find((m) => m.id === +req.params.id);
  if (!movie) return res.status(404).send("The film not found");

  const index = movies.indexOf(movie);
  console.log(index);
  movies.splice(index, 1);

  res.send(movie);
});

const port = process.env.PORT || 2001;
app.listen(port, () => console.log(`Listening on port ${port}`));
