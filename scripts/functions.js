//**** muestra el heroe que recibe por parametro ****/
const renderHeroe = (heroe) => {
    heroesUl.append(`
    
        <li onclick="getHeroe(${heroe.id})">

                <img src="${heroe.thumbnail.path}.${heroe.thumbnail.extension}" alt=${heroe.name}/>
                <h5> ${heroe.name}</h5>

        </li>

    `);
    loader.addClass("hidden");
};

//**** muestra detalles del heroe y sus comics que recibe por parametro ****/
const renderHeroeDetails = (heroe, comics) => {
    console.log(heroe);
    heroeDetails.html(`
    <div class="heroeDetails">
        <h3>${heroe.name}</h3>
        <div class="detailsContainer">
            
            <img src="${heroe.thumbnail.path}.${
        heroe.thumbnail.extension
    }"  alt="${heroe.name}"/>
            <div class="heroeDescription">   
                ${heroe.description != "" ? `<p>${heroe.description}</p>` : ""}
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

    loader.addClass("hidden");
};

//**** agrega heroe recibido por parametro a favoritos ****//
const addToFav = (heroe) => {
    const favs = JSON.parse(localStorage.getItem("favs"));

    console.log(favs);
    console.log(heroe);
    favs.push(heroe);

    localStorage.setItem("favs", JSON.stringify(favs));
    goFavs();
};

//**** elimina heroe recibido por parametro de favoritos ****//
const removeFav = (heroe) => {
    const favs = JSON.parse(localStorage.getItem("favs"));
    for (let i = 0; i < favs.length; i++) {
        favs[i] === heroe && favs.splice(i, 1);
    }
    localStorage.setItem("favs", JSON.stringify(favs));
    goFavs();
};

//**** muestra paginacion y botones de siguiente y anterior ****/
const renderPagination = (data, isSearch) => {
    pagination.html(" ");
    totalPages = Math.ceil(data.data.total / data.data.limit);
    page = data.data.offset / 20 + 1;
    paginationBtns = "";
    let btnsAmount;
    if (window.innerWidth > 550) {
        totalPages > 10 ? (btnsAmount = 10) : (btnsAmount = totalPages);
    } else {
        totalPages > 5 ? (btnsAmount = 5) : (btnsAmount = totalPages);
    }
    for (let i = 0; i < btnsAmount; i++) {
        paginationBtns += `<li class="paginationBtn ${
            page == i + 1 && "selected"
        }" onclick = "${
            isSearch ? `getSearchHero(${i * 20})` : `getAllHeroes(${i * 20})`
        }">${i + 1}</li>`;
    }
    pagination.append(`
                    
                <div class="paginationBar">
                
                    <button ${
                        data.data.offset == 0 && "disabled class='disabled'"
                    } onclick="previousPage(${isSearch})"><</button>
                    <ul>
                         ${paginationBtns}
                    </ul> 
                    <button onclick="nextPage(${isSearch})" >></button>
                </div>
                <p>Pagina ${page} de ${totalPages} </p>
    `);
};

//**** muestra la siguiente pagina ****//
const nextPage = (isSearch) => {
    heroesUl.html("");
    var offset = parseInt(sessionStorage.getItem("offset"));
    offset += 20;
    sessionStorage.setItem("offset", offset);
    isSearch ? getSearchHero(offset) : getAllHeroes(offset);
};

//**** muestra la pagina anterior ****//
const previousPage = (isSearch) => {
    heroesUl.html("");
    var offset = parseInt(sessionStorage.getItem("offset"));
    offset -= 20;
    sessionStorage.setItem("offset", offset);
    isSearch ? getSearchHero(offset) : getAllHeroes(offset);
};

//**** muestra o oculta barra de busqueda ****/
const searchBtnToggle = () => {
    searchForm.toggleClass("hidden");
};

//**** muestra el error pasado por parametro ****//
const showError = (error) => {
    errorContainer.html(" ");
    heroeDetails.html(" ");
    heroeDetails.addClass("hidden");
    heroesContainer.addClass("hidden");
    errorContainer.removeClass("hidden");
    loader.addClass("hidden");
    errorContainer.append(`
            <h2 >Error: ${error}</h2>
            <button onclick="goHome()" >Volver</button>
    `);
};

//**** muestra pantalla principal ****//
const goHome = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
    heroeDetails.html("");
    heroesContainer.removeClass("hidden");
    heroeDetails.addClass("hidden");
    errorContainer.addClass("hidden");
    pagination.removeClass("hidden");
    getAllHeroes(0);
};

//**** muestra favoritos ****//
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
