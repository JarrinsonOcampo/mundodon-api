const cheerio = require('cheerio');
const fetch = require('node-fetch');
const axios = require('axios');
const { baseUrl, searchUrl, allUrl, watchUrl } = require('./urls');

/**
 * @description Obtener los últimos donghua/animes agregados
 */
const latestAnimeAdded = async () => {
  try {
    const res = await fetch(baseUrl);
    const body = await res.text();
    const $ = cheerio.load(body);
    const animes = [];

    $('div.item').each((index, element) => {
      try {
        const $item = $(element);
        const linkElement = $item.find('a').first();
        const link = linkElement.attr('href');
        const image = $item.find('img').attr('src');
        const titleText = $item.find('h5.sf.fc-dark.f-bold').text().trim();
        
        if (link && titleText) {
          animes.push({
            title: titleText,
            link: link,
            image: image ? baseUrl.replace(/\/$/, '') + image : null,
            type: 'Donghua'
          });
        }
      } catch (err) {
        // Skip this item
      }
    });

    return animes;
  } catch (err) {
    console.error('Error in latestAnimeAdded:', err.message);
    return [];
  }
};

/**
 * @description Buscar anime por título
 */
const searchAnime = async (query) => {
  try {
    const searchQuery = encodeURIComponent(query);
    const res = await fetch(`${searchUrl}?q=${searchQuery}`);
    const body = await res.text();
    const $ = cheerio.load(body);
    const animes = [];

    $('div.item').each((index, element) => {
      try {
        const $item = $(element);
        const linkElement = $item.find('a').first();
        const link = linkElement.attr('href');
        const image = $item.find('img').attr('src');
        const titleText = $item.find('h5.sf.fc-dark.f-bold').text().trim();
        
        if (link && titleText && titleText.toLowerCase().includes(query.toLowerCase())) {
          animes.push({
            title: titleText,
            link: link,
            image: image ? baseUrl.replace(/\/$/, '') + image : null,
            type: 'Donghua'
          });
        }
      } catch (err) {
        // Skip this item
      }
    });

    return animes;
  } catch (err) {
    console.error('Error in searchAnime:', err.message);
    return [];
  }
};

/**
 * @description Obtener información de video por episodio y servidor
 */
const getAnimeVideoByServer = async (animeLink, chapter) => {
  try {
    const watchLink = watchUrl + animeLink.split('/ver/')[1];
    const res = await fetch(watchLink);
    const body = await res.text();
    const $ = cheerio.load(body);
    
    const servers = [];
    const videoContainer = $('div#embed, iframe[src*="player"], .video-container');
    
    // Buscar iframes o scripts con videos
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
 * @description Obtener OVAs (sin paginación disponible en mundodonghua)
 */
const getAnimeOvas = async (page) => {
  try {
    const res = await fetch(baseUrl);
    const body = await res.text();
    const $ = cheerio.load(body);
    const ovas = [];

    $('div.item').slice(0, 10).each((index, element) => {
      try {
        const $item = $(element);
        const linkElement = $item.find('a').first();
        const link = linkElement.attr('href');
        const image = $item.find('img').attr('src');
        const titleText = $item.find('h5.sf.fc-dark.f-bold').text().trim();
        
        if (link && titleText) {
          ovas.push({
            title: titleText,
            link: link,
            image: image ? baseUrl.replace(/\/$/, '') + image : null,
            type: 'OVA'
          });
        }
      } catch (err) {
        // Skip
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
    const res = await fetch(baseUrl);
    const body = await res.text();
    const $ = cheerio.load(body);
    const movies = [];

    $('div.item').slice(10, 20).each((index, element) => {
      try {
        const $item = $(element);
        const linkElement = $item.find('a').first();
        const link = linkElement.attr('href');
        const image = $item.find('img').attr('src');
        const titleText = $item.find('h5.sf.fc-dark.f-bold').text().trim();
        
        if (link && titleText) {
          movies.push({
            title: titleText,
            link: link,
            image: image ? baseUrl.replace(/\/$/, '') + image : null,
            type: 'Película'
          });
        }
      } catch (err) {
        // Skip
      }
    });

    return movies;
  } catch (err) {
    console.error('Error in getAnimeMovies:', err.message);
    return [];
  }
};

/**
 * @description Obtener animes por género (función básica)
 */
const getAnimesByGender = async (gender, page) => {
  try {
    // Mundodonghua no tiene URLs de género específicas fácilmente accesibles
    // Retornar búsqueda genérica
    return await searchAnime(gender);
  } catch (err) {
    console.error('Error in getAnimesByGender:', err.message);
    return [];
  }
};

/**
 * @description Obtener animes por letra (función básica)
 */
const getAnimesListByLetter = async (letter, page) => {
  try {
    const res = await fetch(baseUrl);
    const body = await res.text();
    const $ = cheerio.load(body);
    const animes = [];

    $('div.item').each((index, element) => {
      try {
        const $item = $(element);
        const linkElement = $item.find('a').first();
        const link = linkElement.attr('href');
        const image = $item.find('img').attr('src');
        const titleText = $item.find('h5.sf.fc-dark.f-bold').text().trim();
        
        if (link && titleText && titleText.charAt(0).toUpperCase() === letter.toUpperCase()) {
          animes.push({
            title: titleText,
            link: link,
            image: image ? baseUrl.replace(/\/$/, '') + image : null,
            type: 'Donghua'
          });
        }
      } catch (err) {
        // Skip
      }
    });

    return animes;
  } catch (err) {
    console.error('Error in getAnimesListByLetter:', err.message);
    return [];
  }
};

/**
 * @description Obtener horario (función básica)
 */
const schedule = async (day) => {
  try {
    const res = await fetch(baseUrl);
    const body = await res.text();
    const $ = cheerio.load(body);
    const scheduled = [];

    $('div.item').slice(0, 5).each((index, element) => {
      try {
        const $item = $(element);
        const linkElement = $item.find('a').first();
        const link = linkElement.attr('href');
        const image = $item.find('img').attr('src');
        const titleText = $item.find('h5.sf.fc-dark.f-bold').text().trim();
        
        if (link && titleText) {
          scheduled.push({
            title: titleText,
            link: link,
            image: image ? baseUrl.replace(/\/$/, '') + image : null,
            day: day,
            type: 'Donghua'
          });
        }
      } catch (err) {
        // Skip
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
  schedule
};