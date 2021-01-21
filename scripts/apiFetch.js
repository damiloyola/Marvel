// apiKey = "f8b23396eb3de69e79a66091fe7b29c0";
// hash = "addc65eb95126540e2c9889f0632a6ef";

apiKey = "bc7fe627f7908e7c510adbbd29eebe78";
hash = "184dae0b39058edc28b190fc5cf52645";

//**** Hace llamado a la api segun url por parametro ****//
const fetchApi = async (endpoint) => {
    const res = await fetch(endpoint);
    return await res.json();
};

//**** muestra todos los heroes ***//
const getAllHeroes = async (offset) => {
    heroesUl.html("");
    const url = `https://gateway.marvel.com:443/v1/public/characters?orderBy=name&offset=${offset}&ts=1&apikey=${apiKey}&hash=${hash}`;
    const heroes = await fetchApi(url);
    console.log(heroes);
    renderPagination(heroes, false);
    heroes.data.results.map((heroe) => {
        renderHeroe(heroe);
    });
};

//**** muestra un heroe en particular ****//
const getHeroe = async (id) => {
    heroesContainer.addClass("hidden");
    heroeDetails.removeClass("hidden");
    heroeDetails.innerHTML = " ";
    const url = `https://gateway.marvel.com:443/v1/public/characters/${id}?ts=1&apikey=${apiKey}&hash=${hash}`;
    const result = await fetchApi(url);
    const heroe = result.data.results[0];
    const comics = await getComics(heroe);
    renderHeroeDetails(heroe, comics);
};

//**** trae heroes segun busqueda ****/
const getSearchHero = async (offset) => {
    heroesUl.html("");

    heroesContainer.removeClass("hidden");
    heroeDetails.addClass("hidden");
    errorContainer.addClass("hidden");
    favsContainer.addClass("hidden");
    let searchText = searchInput.val();
    let url = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${searchText}&offset=${offset}&ts=1&apikey=${apiKey}&hash=${hash}`;
    const result = await fetchApi(url);
    renderPagination(result, true);
    (await result.data.results.length) > 0
        ? result.data.results.map((heroe) => renderHeroe(heroe))
        : showError("No se encontraron resultados");
};

const getFavs = () => {
    const favs = JSON.parse(localStorage.getItem("favs"));
    favs.map(async (heroeId) => {
        const url = `https://gateway.marvel.com:443/v1/public/characters/${heroeId}?ts=1&apikey=${apiKey}&hash=${hash}`;
        const result = await fetchApi(url);
        const heroe = result.data.results[0];
        renderHeroe(heroe, true);
    });
};

//**** Trae portadas de comics donde aparece el heroe *****//
const getComics = async (heroe) => {
    let comics = [];
    let length;
    heroe.comics.available < 8
        ? (length = heroe.comics.available)
        : (length = 8);

    for (let i = 0; i < length; i++) {
        const comicID = heroe.comics.items[i].resourceURI.slice(
            heroe.comics.items[i].resourceURI.length - 5
        );
        const url = `https://gateway.marvel.com/v1/public/comics/${comicID}?ts=1&apikey=${apiKey}&hash=${hash}`;
        const comic = await fetchApi(url);
        try {
            const comicURL = `${comic.data.results[0].images[0].path}.${comic.data.results[0].images[0].extension}`;
            await comics.push(comicURL);
        } catch (e) {
            showError(" No se pudieron cargar los datos");
        }
    }

    return comics;
};
