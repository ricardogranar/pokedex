/**
 * Requisitos 
 * - Obtener lista pokedex y guardar en variable ✅
 * - Obtener el listado de todos los pokemons ✅
 * - Obtener todos los pokemons individuales uno por uno ✅
 * - Para obtener todos los pokemons, me dice el ejercicio que debo iterar uno por uno. ✅
 * - Añadir al DOM los pokemons, dentro del div pokedex.
 */

 const pokedex$$ = document.querySelector('#pokedex');
 const ALL_POKEMONS_INFO = []; // Cuando una variable se declara en scope global para ser usada por otros, se hace en mayúsculas.
 
 function getAllPokemons() {
   return fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
     .then((response) => response.json())
     .then((response) => {
       return response.results;
     })
     .catch((error) => console.log('Error obteniendo todos los pokemons', error));
 }
 
 function getOnePokemon(url) {
   return fetch(url)
     .then((response) => response.json())
     .then((response) => {
       return response;
     })
     .catch((error) => console.log('Error obteniendo pokemon individual', error));
 }
 
 function renderPokemons(pokemons) {
     pokemons.forEach(function(poke) {
       const li$$ = document.createElement('li');
       li$$.classList.add('card');
     
       const img$$ = document.createElement('img');
       img$$.src = poke.sprites.front_default;
       img$$.alt = poke.name;
     
       const p$$ = document.createElement('p');
       p$$.classList.add('card-title');
       p$$.textContent = poke.name;
     
       const div$$ = document.createElement('div');
       div$$.classList.add('card-subtitle');
       div$$.textContent = poke.types[0].type.name;
     
       li$$.appendChild(img$$);
       li$$.appendChild(p$$);
       li$$.appendChild(div$$);
     
       pokedex$$.appendChild(li$$);
     });
 
 }
 
 // Director de orquesta: irá llamando a otras funciones.
 async function arrancar() {
   console.log('Ejecuntando peticiones pokedex...');
 
   const allPokemons = await getAllPokemons(); // array de objetos con name y url por cada pokemon
   // console.log('allPokemons:', allPokemons)
   
   // Itero por el array de pokemons, llamo a getOnePokemon una vez
   // por cada pokemon, pasándole la url de cada pokemon.
   for(const pokemon of allPokemons) { 
     // Pido a la api la información de cada pokemon individual y la guardo en una variable
     const pokemonIndividualInfo = await getOnePokemon(pokemon.url);
     ALL_POKEMONS_INFO.push(pokemonIndividualInfo);
   };
 
   console.log('ALL_POKEMONS_INFO', ALL_POKEMONS_INFO);
   renderPokemons(ALL_POKEMONS_INFO);
 };
 
 window.onload = arrancar;