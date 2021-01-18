const baseURL =
    "https://gateway.marvel.com:443/v1/public/characters?orderBy=name&ts=1&apikey=f8b23396eb3de69e79a66091fe7b29c0&hash=addc65eb95126540e2c9889f0632a6ef";

const fetchApi = async (endpoint) => {
    await fetch(endpoint)
        .then((response) => response.json())

        .then((data) => showAllHeroes(data.data.results));
};

const showAllHeroes = (heroes) => {
    const container = $("#heroesContainer");

    console.log(heroes);
    return heroes.map((heroe) =>
        container.append(`
    
    <li>
        
            <img src="${heroe.thumbnail.path}.${heroe.thumbnail.extension}"/>
            <h5> ${heroe.name}</h5>
        
   
    </li>
    
    `)
    );
};

fetchApi(baseURL);
