//**** Recibe array de heroes y muestra todos ****/
const renderHeroe = (heroe, isFav) => {
    // let container = heroesUl;
    // isFav && (container = favsContainer);

    // console.log(heroe);
    heroesUl.append(`
    
        <li onclick="getHeroe(${heroe.id})">

                <img src="${heroe.thumbnail.path}.${heroe.thumbnail.extension}" alt=${heroe.name}/>
                <h5> ${heroe.name}</h5>

        </li>

    `);
};

//**** Recibe heroe a mostrar y comics en los que aparece ****/
const renderHeroeDetails = (heroe, comics) => {
    console.log(heroe);
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
                        <button  onclick="goHome()" >Volver al Inicio </button>
                       ${
                           JSON.parse(
                               localStorage.getItem("favs").includes(heroe.id)
                           )
                               ? `<button onclick="removeFav('${heroe.id}')" >Quitar de Favoritos</button>`
                               : `<button onclick="addToFav('${heroe.id}')" >Agregar a Favoritos</button>`
                       } 
                </div>
            </div>
            
        </div>
        
    </div>
`);
};

const addToFav = (heroe) => {
    const favs = JSON.parse(localStorage.getItem("favs"));

    console.log(favs);
    console.log(heroe);
    favs.push(heroe);

    localStorage.setItem("favs", JSON.stringify(favs));
    goFavs();
};

const removeFav = (heroe) => {
    const favs = JSON.parse(localStorage.getItem("favs"));
    for (let i = 0; i < favs.length; i++) {
        favs[i] === heroe && favs.splice(i, 1);
    }
    localStorage.setItem("favs", JSON.stringify(favs));
    goFavs();
};

//**** muestra paginacion y botones ****/

const renderPagination = (data, isSearch) => {
    pagination.html(" ");
    totalPages = Math.ceil(data.data.total / data.data.limit);
    page = data.data.offset / 20 + 1;
    paginationBtns = [];
    for (let i = 0; i < 10; i++) {}
    pagination.append(`
        
        <button ${
            data.data.offset == 0 && "disabled class='disabled'"
        } onclick="previousPage(${isSearch})"><</button>
       
        <button onclick="nextPage(${isSearch})" >></button>
        <p>Pagina ${page} de ${totalPages} </p>
    `);
};
const nextPage = (isSearch) => {
    heroesUl.html("");
    var offset = parseInt(sessionStorage.getItem("offset"));
    offset += 20;
    sessionStorage.setItem("offset", offset);
    isSearch ? getSearchHero(offset) : getAllHeroes(offset);
};
const previousPage = (isSearch) => {
    heroesUl.html("");
    var offset = parseInt(sessionStorage.getItem("offset"));
    offset -= 20;
    sessionStorage.setItem("offset", offset);
    isSearch ? getSearchHero(offset) : getAllHeroes(offset);
};

const searchBtnToggle = () => {
    searchForm.toggleClass("hidden");
};

//muestra en pantalla error por parametro
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

//muestra pantalla inicial
const goHome = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
    heroeDetails.html("");
    heroesContainer.removeClass("hidden");
    heroeDetails.addClass("hidden");
    errorContainer.addClass("hidden");
    pagination.removeClass("hidden");
    getAllHeroes(0);
};

const goFavs = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
    heroesUl.html("");
    heroeDetails.html("");
    heroesContainer.removeClass("hidden");
    pagination.addClass("hidden");
    heroeDetails.addClass("hidden");
    errorContainer.addClass("hidden");
    const heroes = getFavs();
};
