const pokedex$$ = document.querySelector("#pokedex");
const searchInput$$ = document.querySelector(".search-container input");
const ALL_POKEMONS_INFO = [];

// una función que hace un fetch a la api y recuperamos los 150 primeros pokemons.
const getAllPokemons = () =>
  fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
    .then((response) => response.json())
    .then((response) => response.results)
    .catch((error) => console.log("Error obteniendo todos los pokemons", error));

    // una función que nos permite recuperar los pokemons individualemente, con los
    //parametros que nosotros queramos usar en nuestra app.
const getOnePokemon = async (url) => {
  try {
    const response = await fetch(url);
    const result = await response.json();

    return {
      name: result.name,
      id: result.id,
      types: result.types.map((element) => element.type.name),
      image: result.sprites.front_default,
      backImg: result.sprites?.back_default,
      abilities: result.abilities[0].ability.name,
      weight: result.weight,
      height: result.height,
    };
  } catch (error) {}
};

// una función para renderizarlos por los pokemon por tipo.
 const renderTypes = (types, container) => {
  const div$$ = document.createElement("div");
  div$$.classList.add("card-subtitle", "types-container");

  types.forEach((type) => {
    const typeContainer$$ = document.createElement("p");
    typeContainer$$.setAttribute("pokemon-type", type);
    typeContainer$$.style.backgroundColor = typeColors[type];
    typeContainer$$.classList.add("type");
    typeContainer$$.textContent = type;
    typeContainer$$.addEventListener("click", () => {
      searchInput$$.setAttribute("value", type);
      search(type);
    });
    div$$.appendChild(typeContainer$$);
  });

  container.appendChild(div$$);
};
 //Función que vacía la pokedex 
const cleanPokedex = () => (pokedex$$.innerHTML = "");
//Función que nos muestra un mensaje si no existe ningun pokemon que coincida con el parametro 
//de busqueda.
const renderNoResults = () => {
  const li$$ = document.createElement("span");

  const p$$ = document.createElement("p");
  p$$.classList.add("card-title");
  p$$.textContent = "No se encuentran resultados";

  li$$.appendChild(p$$);
  pokedex$$.appendChild(li$$);
};
//Función a la que pasamos como parametro un pokemon y lo renderiza su carta.
//También añade unas clases que nos permiten con css añadir el efecto de flip card.
const renderPokemonCard = (poke) => {
  const flipCard$$ = document.createElement("div");
  flipCard$$.classList.add("flip-card");
  const flipCardInner$$ = document.createElement("div");
  flipCardInner$$.classList.add("flip-card-inner");
  const flipCardFront$$ = document.createElement("div");
  flipCardFront$$.classList.add("flip-card-front");
  const flipCardBack$$ = document.createElement("div");
  flipCardBack$$.classList.add("flip-card-back");
  const backImg$$ = document.createElement("img");
  backImg$$.setAttribute("src", poke.backImg);
  flipCardBack$$.appendChild(backImg$$);

  const img$$ = document.createElement("img");
  img$$.src = poke.image;
  img$$.alt = poke.name;

  const p$$ = document.createElement("p");
  p$$.classList.add("card-title");
  p$$.textContent = poke.name;

  const pAbilities$$ = document.createElement("p");
  pAbilities$$.classList.add("card-stats");
  pAbilities$$.textContent = `Ability: ${poke.abilities}`;

  const pWidth$$ = document.createElement("p");
  pWidth$$.classList.add("card-stats");
  pWidth$$.textContent = `Weight: ${poke.weight} cm`;

  const pHeight$$ = document.createElement("p");
  pHeight$$.classList.add("card-stats");
  pHeight$$.textContent = `Height: ${poke.height} kg`;

  const divId$$ = document.createElement("div");
  divId$$.classList.add("card-subtitle");
  divId$$.textContent = `ID: ${poke.id}`;

  flipCardFront$$.appendChild(img$$);
  flipCardFront$$.appendChild(p$$);
  flipCardFront$$.appendChild(divId$$);
  flipCardBack$$.appendChild(pAbilities$$);
  flipCardBack$$.appendChild(pWidth$$);
  flipCardBack$$.appendChild(pHeight$$);
  flipCardFront$$.appendChild(divId$$);

  flipCard$$.appendChild(flipCardInner$$);
  flipCardInner$$.appendChild(flipCardFront$$);
  flipCardInner$$.appendChild(flipCardBack$$);

  renderTypes(poke.types, flipCardFront$$);

  pokedex$$.appendChild(flipCard$$);
};

//Creamos una función a lo que les pasamos los pokemons como parametro y los 
//renderiza en caso de que existan o muestran un mensaje de error en caso de que no 
//existan.
const renderPokemons = (pokemons) => {
  cleanPokedex();
  if (!pokemons.length) renderNoResults();
  pokemons.forEach((pokemon) => renderPokemonCard(pokemon));
};

// Es una función de busqueda a la que asignamos los parametros que queremos
//que nos busque. Y llama a la función anterior renderPokemons para renderizar
//los resultados de las busqueda.
const search = (value) => {
  const filtered = ALL_POKEMONS_INFO.filter((pokemon) => {
    const matchName = pokemon.name.includes(value);
    const matchId = pokemon.id == value;
    const matchType = pokemon.types.includes(value);

    return matchName || matchId || matchType;
  });
  renderPokemons(filtered);

  console.log(filtered);
};

//Añadimos un evento al input para recoger el valor que se añade en el input
//el valor de busqueda y pasarselo como parametro a la función search.
const addEventsListeners = () => {
  searchInput$$.addEventListener("input", (event) => {
    search(event.target.value);
  });
};

//la función que nos carga la galeria completa de pokemons cada vez que se abre la
//aplicación.
const arrancar = async () => {
  addEventsListeners();
  const allPokemons = await getAllPokemons();

  for (const pokemon of allPokemons) {
    const pokemonIndividualInfo = await getOnePokemon(pokemon.url);
    ALL_POKEMONS_INFO.push(pokemonIndividualInfo);
  }
  console.log("ALL_POKEMONS_INFO", ALL_POKEMONS_INFO);
  renderPokemons(ALL_POKEMONS_INFO);
};

window.onload = arrancar;
