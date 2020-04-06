const express = require("express");
const cors = require("cors");
let yup = require("yup");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (req, res) => {
  return res.json(repositories);
});

app.post("/repositories", async (req, res) => {
  const { title, url, techs } = req.body;
  // let schema = yup.object().shape({
  //   title: yup.string().required(),
  //   url: yup.string().url().required(),
  //   techs: yup.array().required(),
  // });

  // if (!(await schema.isValid(req.body))) {
  //   return res
  //     .status(400)
  //     .json({ error: "You must fill: title, url and techs[]" });
  // }

  const id = uuid();
  const newRepo = {
    id,
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(newRepo);

  res.json(newRepo);
});

app.put("/repositories/:id", async (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;

  const repository = repositories.find((obj) => obj.id == id);

  // let schema = yup.object().shape({
  //   title: yup.string().required(),
  //   url: yup.string().url().required(),
  //   techs: yup.array().required(),
  // });

  // if (!(await schema.isValid(req.body))) {
  //   return res
  //     .status(400)
  //     .json({ error: "You must fill: title, url and techs[]" });
  // }

  if (!repository) {
    return res.status(400).json({ error: "Repository not found!" });
  }

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return res.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const objIndex = repositories.findIndex((obj) => obj.id == id);
  if (objIndex < 0) {
    return res.status(400).json({ error: "Repository not found!" });
  }

  repositories.splice(objIndex, 1);

  return res.status(204).json({});
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;
  const objIndex = repositories.findIndex((obj) => obj.id == id);
  if (objIndex < 0) {
    return res.status(400).json({});
  }

  repositories[objIndex].likes++;
  // const likes = repositories[objIndex].likes;

  return res.json(repositories[objIndex]);
});

module.exports = app;
