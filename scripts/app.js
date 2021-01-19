//**** DOM ****//
const heroesContainer = $("#heroesContainer");
const heroesUl = $("#heroesUl");
const heroeDetails = $("#heroeDetails");
const searchForm = $("#searchForm");
const searchInput = $("#searchInput");
const errorContainer = $("#errorContainer");

//**** Funcion para hacer llamado a la api ****//
const fetchApi = async (endpoint) => {
    const res = await fetch(endpoint);
    return await res.json();
};

const populateHeroes = (heroes) => {
    heroesUl.html(" ");
    console.log(heroes);
    heroes.map((heroe) =>
        heroesUl.append(`

        <li onclick="showHeroe(${heroe.id})">

                <img src="${heroe.thumbnail.path}.${heroe.thumbnail.extension}" alt=${heroe.name}/>
                <h5> ${heroe.name}</h5>

        </li>

    `)
    );
};

//**** Funcion para mostrar todos los resultados ***//
const showAllHeroes = async () => {
    const url =
        "https://gateway.marvel.com:443/v1/public/characters?orderBy=name&ts=1&apikey=f8b23396eb3de69e79a66091fe7b29c0&hash=addc65eb95126540e2c9889f0632a6ef";
    const heroes = await fetchApi(url);

    populateHeroes(heroes.data.results);
};

//**** Funcion que muestra un heroe en particular ****//
const showHeroe = async (id) => {
    heroeDetails.innerHTML = " ";
    const url = `https://gateway.marvel.com:443/v1/public/characters/${id}?ts=1&apikey=f8b23396eb3de69e79a66091fe7b29c0&hash=addc65eb95126540e2c9889f0632a6ef`;
    const result = await fetchApi(url);

    heroe = result.data.results[0];

    heroesContainer.toggleClass("hidden");
    heroeDetails.toggleClass("hidden");
    /*Funcion que trae las img de comics donde aparece*/
    const getComics = async () => {
        let comics = [];
        let length;
        heroe.comics.available < 8
            ? (length = heroe.comics.available)
            : (length = 8);

        for (let i = 0; i < length; i++) {
            const url =
                heroe.comics.items[i].resourceURI +
                "?ts=1&apikey=f8b23396eb3de69e79a66091fe7b29c0&hash=addc65eb95126540e2c9889f0632a6ef";
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
    const comics = await getComics();

    heroeDetails.append(`
        <div class="heroeDetails">
            <h3>${heroe.name}</h3>
            <div class="detailsContainer">
                
                <img src="${heroe.thumbnail.path}.${
        heroe.thumbnail.extension
    }"  alt="${heroe.name}"/>
                <div class="heroeDescription">   
                    ${heroe.description != " " && `<p>${heroe.description}</p>`}
                    <h4>Aparece en:</h4>
                    <div class="comicsContainer">
                       ${comics.map((comicImg) => `<img src="${comicImg}"/>`)}
                    </div>
                
                    <div class="detailsButtons">
                            <button  onclick="goHome()"}>Volver al Inicio </button>
                            <button  >Agregar a Favorito</button>
                    </div>
                </div>
                
            </div>
            
        </div>
    `);
};

const goHome = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
    heroeDetails.html("");
    heroesContainer.removeClass("hidden");
    heroeDetails.addClass("hidden");
    errorContainer.addClass("hidden");
};

const searchBtnToggle = () => {
    searchForm.toggleClass("hidden");
};

const searchHero = async (e) => {
    e.preventDefault();
    heroeDetails.addClass("hidden");
    errorContainer.addClass("hidden");
    heroesContainer.removeClass("hidden");
    let searchText = searchInput.val();
    let url = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${searchText}&ts=1&apikey=f8b23396eb3de69e79a66091fe7b29c0&hash=addc65eb95126540e2c9889f0632a6ef`;
    const result = await fetchApi(url);
    (await result.data.results.length) > 0
        ? populateHeroes(result.data.results)
        : showError("No se encontraron resultados");
    console.log(result);
};

const showError = (error) => {
    errorContainer.html(" ");
    heroeDetails.html(" ");
    heroeDetails.addClass("hidden");
    heroesContainer.addClass("hidden");
    errorContainer.removeClass("hidden");
    errorContainer.append(`

    <h2 >Error: ${error}</h2>
    <button onclick="goHome()" >Volver</button>
`);
};

showAllHeroes();
