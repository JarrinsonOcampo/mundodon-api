const cheerio = require('cheerio');
const fetch = require('node-fetch');
const axios = require('axios');
const { baseUrl, searchUrl, allUrl, watchUrl, listUrl } = require('./urls');

// Headers para evitar el error 403
const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "es-ES,es;q=0.9,en;q=0.8"
};

/**
 * @description Obtener los últimos episodios agregados (Home)
 * Selector: .col-6.col-sm-6.col-md-4.col-lg-3.mb-4
 */
const latestAnimeAdded = async () => {
  try {
    const res = await fetch(baseUrl, { headers });
    const body = await res.text();
    const $ = cheerio.load(body);
    const episodios = [];

    // Selector específico para las tarjetas de episodios
    $('.col-6.col-sm-6.col-md-4.col-lg-3.mb-4').each((index, element) => {
      try {
        const $card = $(element);
        const $link = $card.find('a').first();
        const url_slug = $link.attr('href');
        
        // Título del donghua (h5 o title del enlace)
        let titulo = $card.find('h5').text().trim();
        if (!titulo) {
          titulo = $link.attr('title') || '';
        }
        
        // Número de episodio
        let episodio_nro = '';
        const episodeText = $card.find('.episode, span[class*="episode"], span[class*="cap"]').text().trim();
        if (episodeText) {
          const match = episodeText.match(/episodio\s*(\d+)/i) || episodeText.match(/(\d+)/);
          if (match) episodio_nro = match[1];
        }
        
        // Thumbnail
        const thumbnail = $card.find('img').attr('src') || '';
        
        // Fecha (opcional, si está disponible)
        const fecha = new Date().toISOString().split('T')[0]; // Fecha actual por defecto
        
        if (url_slug && titulo) {
          episodios.push({
            titulo: titulo,
            episodio_nro: episodio_nro,
            fecha: fecha,
            url_slug: url_slug,
            thumbnail: thumbnail.startsWith('http') ? thumbnail : baseUrl.replace(/\/$/, '') + thumbnail
          });
        }
      } catch (err) {
        // Skip this item
        console.error('Error parsing item:', err.message);
      }
    });

    return episodios;
  } catch (err) {
    console.error('Error in latestAnimeAdded:', err.message);
    return [];
  }
};

/**
 * @description Buscar donghua por título
 */
const searchAnime = async (query) => {
  try {
    const searchQuery = encodeURIComponent(query);
    const res = await fetch(`${searchUrl}?q=${searchQuery}`, { headers });
    const body = await res.text();
    const $ = cheerio.load(body);
    const resultados = [];

    $('.col-6.col-sm-6.col-md-4.col-lg-3.mb-4, .anim-card, div.item').each((index, element) => {
      try {
        const $card = $(element);
        const $link = $card.find('a').first();
        const url_slug = $link.attr('href');
        
        let titulo = $card.find('h5').text().trim();
        if (!titulo) {
          titulo = $link.attr('title') || $card.find('h5.sf.fc-dark.f-bold').text().trim();
        }
        
        const thumbnail = $card.find('img').attr('src') || '';
        
        if (url_slug && titulo) {
          resultados.push({
            titulo: titulo,
            url_slug: url_slug,
            thumbnail: thumbnail.startsWith('http') ? thumbnail : baseUrl.replace(/\/$/, '') + thumbnail,
            tipo: 'Donghua'
          });
        }
      } catch (err) {
        console.error('Error parsing search item:', err.message);
      }
    });

    return resultados;
  } catch (err) {
    console.error('Error in searchAnime:', err.message);
    return [];
  }
};

/**
 * @description Obtener lista completa de series/donghuas
 * URL: https://www.mundodonghua.com/lista-donghuas
 */
const getAllDonghuas = async () => {
  try {
    const res = await fetch(listUrl, { headers });
    const body = await res.text();
    const $ = cheerio.load(body);
    const donghuas = [];

    $('.anim-card, .col-6.col-sm-6.col-md-4.col-lg-3.mb-4, div.item').each((index, element) => {
      try {
        const $card = $(element);
        const $link = $card.find('a').first();
        const url_slug = $link.attr('href');
        
        let titulo = $card.find('h5').text().trim();
        if (!titulo) {
          titulo = $link.attr('title') || '';
        }
        
        const thumbnail = $card.find('img').attr('src') || '';
        
        // Géneros (si están disponibles)
        const generos = [];
        $card.find('.genre-link, .genre, .tag').each((i, el) => {
          const genero = $(el).text().trim();
          if (genero) generos.push(genero);
        });
        
        if (url_slug && titulo) {
          donghuas.push({
            titulo: titulo,
            url_slug: url_slug,
            thumbnail: thumbnail.startsWith('http') ? thumbnail : baseUrl.replace(/\/$/, '') + thumbnail,
            generos: generos.length > 0 ? generos : [],
            tipo: 'Donghua'
          });
        }
      } catch (err) {
        console.error('Error parsing donghua item:', err.message);
      }
    });

    return donghuas;
  } catch (err) {
    console.error('Error in getAllDonghuas:', err.message);
    return [];
  }
};

/**
 * @description Obtener detalle de un donghua específico (sinopsis, estado, capítulos)
 * @param {string} slug - El slug del donghua (ejemplo: "/donghua/nombre-del-donghua")
 */
const getDonghuaDetail = async (slug) => {
  try {
    const url = slug.startsWith('http') ? slug : baseUrl.replace(/\/$/, '') + slug;
    const res = await fetch(url, { headers });
    const body = await res.text();
    const $ = cheerio.load(body);
    
    // Título
    const titulo = $('h1, h2.title, .title').first().text().trim();
    
    // Sinopsis (ID #sinopsis o párrafo en .description)
    let sinopsis = $('#sinopsis').text().trim();
    if (!sinopsis) {
      sinopsis = $('.description, .synopsis, p.text-justify').first().text().trim();
    }
    
    // Estado (Emisión/Finalizado)
    let estado = 'Desconocido';
    const estadoText = $('.status, .state, .info-item').filter((i, el) => {
      return $(el).text().toLowerCase().includes('estado');
    }).text();
    
    if (estadoText) {
      if (estadoText.toLowerCase().includes('emisi') || estadoText.toLowerCase().includes('ongoing')) {
        estado = 'En emisión';
      } else if (estadoText.toLowerCase().includes('finalizado') || estadoText.toLowerCase().includes('completed')) {
        estado = 'Finalizado';
      }
    }
    
    // Thumbnail
    const thumbnail = $('.donghua-image img, .poster img, img.img-fluid').first().attr('src') || '';
    
    // Géneros
    const generos = [];
    $('.genre-link, .genre, .tag, a[href*="genero"]').each((i, el) => {
      const genero = $(el).text().trim();
      if (genero) generos.push(genero);
    });
    
    // Lista de capítulos (ID #episode-list o contenedor similar)
    const capitulos = [];
    $('#episode-list a, .episode-list a, .chapter-list a, ul.episodes li a').each((i, el) => {
      const $cap = $(el);
      const capUrl = $cap.attr('href');
      const capTitulo = $cap.text().trim() || $cap.attr('title') || '';
      
      if (capUrl) {
        capitulos.push({
          numero: i + 1,
          titulo: capTitulo,
          url: capUrl
        });
      }
    });
    
    return {
      titulo: titulo,
      sinopsis: sinopsis,
      estado: estado,
      thumbnail: thumbnail.startsWith('http') ? thumbnail : baseUrl.replace(/\/$/, '') + thumbnail,
      generos: generos,
      capitulos: capitulos,
      total_capitulos: capitulos.length
    };
  } catch (err) {
    console.error('Error in getDonghuaDetail:', err.message);
    return {
      error: err.message,
      titulo: '',
      sinopsis: '',
      estado: 'Error',
      capitulos: []
    };
  }
};

/**
 * @description Obtener información de video por episodio y servidor
 */
const getAnimeVideoByServer = async (animeLink, chapter) => {
  try {
    let watchLink;
    if (animeLink.includes('/ver/')) {
      watchLink = animeLink.startsWith('http') ? animeLink : baseUrl.replace(/\/$/, '') + animeLink;
    } else {
      watchLink = watchUrl + animeLink;
    }
    
    const res = await fetch(watchLink, { headers });
    const body = await res.text();
    const $ = cheerio.load(body);
    
    const servers = [];
    
    // Buscar iframes con videos
    $('iframe').each((index, element) => {
      const src = $(element).attr('src');
      if (src) {
        servers.push({
          server: `Servidor ${index + 1}`,
          iframe: src,
          video: src
        });
      }
    });

    // Si no hay iframes, buscar en scripts
    if (servers.length === 0) {
      const scripts = $('script');
      scripts.each((i, el) => {
        const content = $(el).html();
        if (content && content.includes('http') && (content.includes('.mp4') || content.includes('src'))) {
          const urls = content.match(/https?:\/\/[^\s"'<>]+\.mp4/g);
          if (urls) {
            urls.forEach((url, idx) => {
              servers.push({
                server: `Servidor ${idx + 1}`,
                video: url
              });
            });
          }
        }
      });
    }

    return servers.length > 0 ? servers : [{ server: 'Defecto', video: null, message: 'No se encontraron servidores' }];
  } catch (err) {
    console.error('Error in getAnimeVideoByServer:', err.message);
    return [{ server: 'Error', video: null, message: err.message }];
  }
};

/**
 * @description Obtener OVAs
 */
const getAnimeOvas = async (page) => {
  try {
    const res = await fetch(baseUrl, { headers });
    const body = await res.text();
    const $ = cheerio.load(body);
    const ovas = [];

    $('.col-6.col-sm-6.col-md-4.col-lg-3.mb-4').slice(0, 10).each((index, element) => {
      try {
        const $card = $(element);
        const $link = $card.find('a').first();
        const url_slug = $link.attr('href');
        
        let titulo = $card.find('h5').text().trim();
        if (!titulo) titulo = $link.attr('title') || '';
        
        const thumbnail = $card.find('img').attr('src') || '';
        
        if (url_slug && titulo) {
          ovas.push({
            titulo: titulo,
            url_slug: url_slug,
            thumbnail: thumbnail.startsWith('http') ? thumbnail : baseUrl.replace(/\/$/, '') + thumbnail,
            tipo: 'OVA'
          });
        }
      } catch (err) {
        console.error('Error parsing OVA:', err.message);
      }
    });

    return ovas;
  } catch (err) {
    console.error('Error in getAnimeOvas:', err.message);
    return [];
  }
};

/**
 * @description Obtener películas
 */
const getAnimeMovies = async (page) => {
  try {
    const res = await fetch(baseUrl, { headers });
    const body = await res.text();
    const $ = cheerio.load(body);
    const movies = [];

    $('.col-6.col-sm-6.col-md-4.col-lg-3.mb-4').slice(10, 20).each((index, element) => {
      try {
        const $card = $(element);
        const $link = $card.find('a').first();
        const url_slug = $link.attr('href');
        
        let titulo = $card.find('h5').text().trim();
        if (!titulo) titulo = $link.attr('title') || '';
        
        const thumbnail = $card.find('img').attr('src') || '';
        
        if (url_slug && titulo) {
          movies.push({
            titulo: titulo,
            url_slug: url_slug,
            thumbnail: thumbnail.startsWith('http') ? thumbnail : baseUrl.replace(/\/$/, '') + thumbnail,
            tipo: 'Película'
          });
        }
      } catch (err) {
        console.error('Error parsing movie:', err.message);
      }
    });

    return movies;
  } catch (err) {
    console.error('Error in getAnimeMovies:', err.message);
    return [];
  }
};

/**
 * @description Obtener animes por género
 */
const getAnimesByGender = async (gender, page) => {
  try {
    return await searchAnime(gender);
  } catch (err) {
    console.error('Error in getAnimesByGender:', err.message);
    return [];
  }
};

/**
 * @description Obtener animes por letra
 */
const getAnimesListByLetter = async (letter, page) => {
  try {
    const res = await fetch(listUrl || baseUrl, { headers });
    const body = await res.text();
    const $ = cheerio.load(body);
    const animes = [];

    $('.col-6.col-sm-6.col-md-4.col-lg-3.mb-4, .anim-card').each((index, element) => {
      try {
        const $card = $(element);
        const $link = $card.find('a').first();
        const url_slug = $link.attr('href');
        
        let titulo = $card.find('h5').text().trim();
        if (!titulo) titulo = $link.attr('title') || '';
        
        const thumbnail = $card.find('img').attr('src') || '';
        
        if (url_slug && titulo && titulo.charAt(0).toUpperCase() === letter.toUpperCase()) {
          animes.push({
            titulo: titulo,
            url_slug: url_slug,
            thumbnail: thumbnail.startsWith('http') ? thumbnail : baseUrl.replace(/\/$/, '') + thumbnail,
            tipo: 'Donghua'
          });
        }
      } catch (err) {
        console.error('Error parsing letter item:', err.message);
      }
    });

    return animes;
  } catch (err) {
    console.error('Error in getAnimesListByLetter:', err.message);
    return [];
  }
};

/**
 * @description Obtener horario
 */
const schedule = async (day) => {
  try {
    const res = await fetch(baseUrl, { headers });
    const body = await res.text();
    const $ = cheerio.load(body);
    const scheduled = [];

    $('.col-6.col-sm-6.col-md-4.col-lg-3.mb-4').slice(0, 5).each((index, element) => {
      try {
        const $card = $(element);
        const $link = $card.find('a').first();
        const url_slug = $link.attr('href');
        
        let titulo = $card.find('h5').text().trim();
        if (!titulo) titulo = $link.attr('title') || '';
        
        const thumbnail = $card.find('img').attr('src') || '';
        
        if (url_slug && titulo) {
          scheduled.push({
            titulo: titulo,
            url_slug: url_slug,
            thumbnail: thumbnail.startsWith('http') ? thumbnail : baseUrl.replace(/\/$/, '') + thumbnail,
            dia: day,
            tipo: 'Donghua'
          });
        }
      } catch (err) {
        console.error('Error parsing schedule item:', err.message);
      }
    });

    return scheduled;
  } catch (err) {
    console.error('Error in schedule:', err.message);
    return [];
  }
};

module.exports = {
  latestAnimeAdded,
  getAnimeOvas,
  getAnimeMovies,
  getAnimesByGender,
  getAnimesListByLetter,
  searchAnime,
  getAnimeVideoByServer,
  schedule,
  getAllDonghuas,
  getDonghuaDetail
};