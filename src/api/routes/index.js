const express = require('express');
const router = express.Router();
const api = require('../api');

// Obtener los últimos episodios agregados
router.get('/latestAnimes' , (req , res) =>{
  api.latestAnimeAdded()
    .then(episodios =>{
      res.status(200).json({
        episodios
      });
    }).catch((err) =>{
      console.error(err);
      res.status(500).json({ error: 'Error al obtener últimos episodios' });
    });
});

// Obtener lista completa de donghuas
router.get('/donghuas', (req, res) => {
  api.getAllDonghuas()
    .then(donghuas => {
      res.status(200).json({
        donghuas,
        total: donghuas.length
      });
    }).catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener lista de donghuas' });
    });
});

// Obtener detalle de un donghua específico
router.get('/donghua/:slug', (req, res) => {
  const slug = req.params.slug;
  api.getDonghuaDetail(`/donghua/${slug}`)
    .then(detalle => {
      res.status(200).json(detalle);
    }).catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener detalle del donghua' });
    });
});

router.get('/ovas/:page' , (req , res) =>{
  const page = req.params.page;
  api.getAnimeOvas(page)
    .then(ovas =>{
      res.status(200).json({
        ovas
      });
    }).catch((err) =>{
      console.error(err);
      res.status(500).json({ error: 'Error al obtener OVAs' });
    });
});

router.get('/movies/:page' , (req , res) =>{
  const page = req.params.page;
  api.getAnimeMovies(page)
    .then(movies =>{
      res.status(200).json({
        movies
      });
    }).catch((err) =>{
      console.error(err);
      res.status(500).json({ error: 'Error al obtener películas' });
    });
});

router.get('/genres/:genre/:page' , (req , res) =>{
  let gender = req.params.genre.toLowerCase();
  let page = req.params.page;
  api.getAnimesByGender(gender , page)
    .then(animes =>{
      res.status(200).json({
        animes
      });
    }).catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener por género' });
    });
});

router.get('/letter/:letter/:page', (req , res) => {
  const letter= req.params.letter.toUpperCase();
  const page = req.params.page;
  api.getAnimesListByLetter(letter , page)
    .then(animes => {
      res.status(200).json({
        animes
      });
    }).catch((err) =>{
      console.log(err);
      res.status(500).json({ error: 'Error al obtener por letra' });
    });
});

router.get('/search/:title', (req , res) => {
  const title = req.params.title;
  api.searchAnime(title)
    .then(animes => {
      res.status(200).json({
        animes
      });
    }).catch((err) =>{
      console.log(err);
      res.status(500).json({ error: 'Error en la búsqueda' });
    });
});

router.get('/video/:id/:chapter', (req , res) => {
  const id = req.params.id;
  const chapter = req.params.chapter;
  api.getAnimeVideoByServer(id , chapter)
    .then(video => {
      res.status(200).json({
        video
      });
    }).catch((err) =>{
      console.log(err);
      res.status(500).json({ error: 'Error al obtener video' });
    });
});

router.get('/schedule/:day', (req , res) => {
  const day = req.params.day;
  api.schedule(day)
    .then(schedule => {
      res.status(200).json({
        schedule
      });
    }).catch((err) =>{
      console.log(err);
      res.status(500).json({ error: 'Error al obtener horario' });
    });
});

module.exports = router;


module.exports = router;