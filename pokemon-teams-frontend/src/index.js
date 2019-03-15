const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const MAIN = document.querySelector('main')

document.addEventListener("DOMContentLoaded", () => {
  renderTrainers();
})

function renderTrainers() {
  fetch(TRAINERS_URL)
  .then(response => response.json())
  .then(json => {
    json.forEach(trainer => {
      console.log(trainer)
      const card = document.createElement('div');
      card.setAttribute('class', 'card');
      card.dataset.id = trainer.id;
      MAIN.appendChild(card);

      const name = document.createElement('p');
      name.innerText = trainer.name;
      card.appendChild(name);

      const addButton = document.createElement('button');
      addButton.dataset.trainerId = trainer.id;
      addButton.innerText = "Add Pokemon";
      addButton.addEventListener('click', handleAddPokemon);
      card.appendChild(addButton);

      const pokemonList = document.createElement('ul');
      card.appendChild(pokemonList);

      trainer.pokemons.forEach(pokemon => {
        addPokemon(pokemon, pokemonList);
      })
    });
  })
}

function handleAddPokemon(e) {
  // console.log(e.target);
  fetch(POKEMONS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      trainer_id: e.target.dataset.trainerId
    })
  })
  .then(response => response.json())
  .then(json => {
    if (!json.error) {
      const card = MAIN.querySelector(`.card[data-id="${e.target.dataset.trainerId}"]`);
      const list = card.querySelector('ul');

      addPokemon(json, list)
    }
  })
}

function addPokemon(pokemon, list) {
  const item = document.createElement('li');
  item.textContent = `${pokemon.nickname} (${pokemon.species})`;

  const releaseButton = document.createElement('button');
  releaseButton.setAttribute('class', 'release')
  releaseButton.innerText = "Release";
  releaseButton.dataset.pokemonId = pokemon.id;
  releaseButton.addEventListener('click', handleRemovePokemon)
  item.appendChild(releaseButton);

  list.appendChild(item);
}

function handleRemovePokemon(e) {
  fetch(`${POKEMONS_URL}/${e.target.dataset.pokemonId}`, {
    method: "DELETE"
  })
  // .then(response => console.log(response))

  e.target.parentNode.remove();
}
