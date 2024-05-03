async function buscarPokemon(nombre) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`);
        if (!response.ok) {
            throw new Error('No se encontró ningún Pokémon con ese nombre');
        }
        const data = await response.json();
        const speciesResponse = await fetch(data.species.url);
        const speciesData = await speciesResponse.json();
        const hasEvolution = speciesData.evolution_chain !== null;
        limpiarPantalla();

        mostrarPokemon(data.name, data.sprites.front_default, data.types, speciesData.flavor_text_entries[0].flavor_text, data.abilities, hasEvolution);
    } catch (error) {
        console.error('Error al buscar el Pokémon:', error);
        limpiarPantalla();
        mostrarError();
    }
}

function mostrarPokemon(nombre, imagen, tipos, descripcion, habilidades, tieneEvolucion) {
    const nombrePokemonElement = document.querySelector('.pokemonName');
    nombrePokemonElement.textContent = nombre.charAt(0).toUpperCase() + nombre.slice(1);

    const imagenPokemonElement = document.querySelector('.pokemonImg');
    imagenPokemonElement.src = imagen;
    imagenPokemonElement.alt = `Imagen de ${nombre}`;

    const tipoPokemonElement = document.querySelector('.pokemonType');
    tipoPokemonElement.textContent = tipos.map(type => type.type.name).join(', ');

    const descripcionPokemonElement = document.querySelector('.pokemonDescrition');
    descripcionPokemonElement.textContent = descripcion;

    const habilidadesPokemonElement = document.querySelector('.pokemonAbilities');
    habilidadesPokemonElement.textContent = habilidades.map(ability => ability.ability.name).join(', ');

    // Boton evolucion
    const botonEvolucion = document.querySelector('.buttonEvolution');
    if (tieneEvolucion) {
        botonEvolucion.style.display = 'block';
        botonEvolucion.addEventListener('click', () => evolucionarPokemon(nombre));
    } else {
        botonEvolucion.style.display = 'none';
    }
    const tarjetaPokemon = document.querySelector('.containerInfo');
    tarjetaPokemon.style.display = 'block';
}

function mostrarError() {
    const errorElement = document.querySelector('.containerError');
    errorElement.style.display = 'block';
}

async function evolucionarPokemon(nombre) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${nombre.toLowerCase()}`);
        const data = await response.json();
        const evolutionResponse = await fetch(data.evolution_chain.url);
        const evolutionData = await evolutionResponse.json();

        const evolvesTo = evolutionData.chain.evolves_to[0];
        const evolutionName = evolvesTo.species.name;
        limpiarPantalla();
        buscarPokemon(evolutionName);
    } catch (error) {
        console.error('Error al evolucionar el Pokémon:', error);
    }
}

// Busqueda
document.querySelector('.buttonSearch').addEventListener('click', () => {
    const nombrePokemon = document.getElementById('in1').value.trim();
    if (nombrePokemon !== '') {
        buscarPokemon(nombrePokemon);
    }
});

// Para limpiar mi pantalla
function limpiarPantalla() {
    document.querySelector('.containerInfo').style.display = 'none';
    document.querySelector('.containerError').style.display = 'none';
}
