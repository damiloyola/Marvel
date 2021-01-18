//**** DOM ****//
const heroesContainer = $("#heroesContainer");
const heroesUl = $("#heroesUl");
const heroeDetails = $("#heroeDetails");

//**** Funcion para hacer llamado a la api ****//
const fetchApi = async (endpoint) => {
    const res = await fetch(endpoint);
    return await res.json();
};

//**** Funcion para mostrar todos los resultados ***//
const showAllHeroes = async () => {
    const url =
        "https://gateway.marvel.com:443/v1/public/characters?orderBy=name&ts=1&apikey=f8b23396eb3de69e79a66091fe7b29c0&hash=addc65eb95126540e2c9889f0632a6ef";
    const heroes = await fetchApi(url);

    heroes.data.results.map((heroe) =>
        heroesUl.append(`

        <li onclick="showHeroe(${heroe.id})">

                <img src="${heroe.thumbnail.path}.${heroe.thumbnail.extension}" alt=${heroe.name}/>
                <h5> ${heroe.name}</h5>

        </li>

        `)
    );
};

//**** Funcion que muestra un heroe en particular ****//
const showHeroe = async (id) => {
    heroeDetails.innerHTML = " ";
    const url = `https://gateway.marvel.com:443/v1/public/characters/${id}?ts=1&apikey=f8b23396eb3de69e79a66091fe7b29c0&hash=addc65eb95126540e2c9889f0632a6ef`;
    const result = await fetchApi(url);

    heroe = result.data.results[0];
    console.log(heroe);
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
            const comicURL = `${comic.data.results[0].images[0].path}.${comic.data.results[0].images[0].extension}`;
            await comics.push(comicURL);
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
                            <button onclick="goHome()"}>Volver al Inicio </button>
                            <button>Agregar a Favorito</button>
                    </div>
                </div>
                
            </div>
            
        </div>
    `);
};

const goHome = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
    heroeDetails.html("");
    heroesContainer.toggleClass("hidden");
    heroeDetails.toggleClass("hidden");
};

showAllHeroes();
