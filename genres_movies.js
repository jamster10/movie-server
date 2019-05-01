'use strict';



function getGenres(MOVIES){
  return MOVIES.reduce( (arrOfGenres, currentMovie) => {
  let movieGenres = currentMovie.genre.split(', ');

  const additionalGenres = [];
  movieGenres.forEach( genre =>{
    if (!arrOfGenres.includes(genre.toLowerCase() )){
      additionalGenres.push(genre.toLowerCase());
    }
  });
  return additionalGenres.length !== 0 ? [...additionalGenres, ...arrOfGenres] : arrOfGenres;
  }, []);
}

function getCountries (MOVIES){
  return MOVIES.reduce( (arrOfCountries, currentMovie) => {
    let movieCountries = currentMovie.country.split(', ');

    const additionalCountries = [];
    movieCountries.forEach( country =>{
      if (!arrOfCountries.includes(country.toLowerCase() )){
        additionalCountries.push(country.toLowerCase());
      }
    });
    return additionalCountries.length !== 0 ? [...additionalCountries, ...arrOfCountries] : arrOfCountries;
  }, [])
}

module.exports = {
  getCountries,
  getGenres
}