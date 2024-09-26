// Select DOM elements
const searchButton = document.getElementById('search-btn');
const pokemonSearchInput = document.getElementById('pokemon-search');
const pokemonImage = document.getElementById('pokemon-image');
const pokemonName = document.getElementById('pokemon-name');
const pokemonHeight = document.getElementById('pokemon-height');
const pokemonWeight = document.getElementById('pokemon-weight');
const pokemonType = document.getElementById('pokemon-type');
const pokemonAbilities = document.getElementById('pokemon-abilities');
const pokemonEvolutions = document.getElementById('pokemon-evolutions');

// Add event listener to the search button
searchButton.addEventListener('click', async () => {
    const searchTerm = pokemonSearchInput.value.toLowerCase();
    
    if (searchTerm) {
        // Fetch data from PokeAPI
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
            const data = response.data;

            // Update the left side (image)
            pokemonImage.src = data.sprites.front_default;
            pokemonImage.style.display = 'block';

            // Update the right side (stats)
            pokemonName.textContent = `Name: ${data.name}`;
            pokemonHeight.textContent = `${data.height / 10} ft`;  
            pokemonWeight.textContent = `${data.weight / 10} lbs`; 

            let types = data.types.map(type => type.type.name).join(', ');
            pokemonType.textContent = types;

            let abilities = data.abilities.map(ability => ability.ability.name).join(', ');
            pokemonAbilities.textContent = abilities;

            // Fetch species data to get evolution chain
            const speciesResponse = await axios.get(data.species.url);
            const speciesData = speciesResponse.data;

            // Fetch evolution chain
            const evolutionChainResponse = await axios.get(speciesData.evolution_chain.url);
            const evolutionData = evolutionChainResponse.data.chain;

            // Parse and display evolution chain
            let evolutions = [];
            let currentEvolution = evolutionData;

            // Traverse through evolution chain
            do {
                evolutions.push(currentEvolution.species.name);
                currentEvolution = currentEvolution.evolves_to[0];
            } while (currentEvolution);

            pokemonEvolutions.textContent = evolutions.join(' → ');

        } catch (error) {
            // Handle error, e.g., if Pokémon is not found
            pokemonName.textContent = 'Pokémon not found. Please try again.';
            pokemonImage.style.display = 'none';
            pokemonHeight.textContent = 'Unknown';
            pokemonWeight.textContent = 'Unknown';
            pokemonType.textContent = 'Unknown';
            pokemonAbilities.textContent = 'Unknown';
            pokemonEvolutions.textContent = 'N/A';
        }
    } else {
        pokemonName.textContent = 'Please enter a valid Pokémon name or ID.';
        pokemonImage.style.display = 'none';
        pokemonHeight.textContent = 'Unknown';
        pokemonWeight.textContent = 'Unknown';
        pokemonType.textContent = 'Unknown';
        pokemonAbilities.textContent = 'Unknown';
        pokemonEvolutions.textContent = 'N/A';
    }
});
