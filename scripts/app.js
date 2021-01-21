// Se inicializan variables locales y de sesion
sessionStorage.setItem("offset", 0);
localStorage.getItem("favs") === null && localStorage.setItem("favs", "[]");

// muestra todos los heroes en la pagina principal
getAllHeroes(0);
