let tabCountries = null;
let tabFavorites = null;
let allCountries = [];
let favoriteCountries = [];
let countCountries = 0;
let countFavorites = 0;
let totalPopulationList = 0;
let totalPopulationFavorites = 0;
let numberFormat = null;

window.addEventListener("load", () => {
  tabCountries = document.getElementById("tabCountries");
  tabFavorites = document.getElementById("tabFavorites");
  countCountries = document.getElementById("countCountries");
  countFavorites = document.getElementById("countFavorites");
  totalPopulationList = document.getElementById("totalPopulationList");
  totalPopulationFavorites = document.getElementById(
    "totalPopulationFavorites"
  );
  numberFormat = Intl.NumberFormat("pt-BR");

  fetchCountries();
});

async function fetchCountries() {
  const res = await fetch("https://restcountries.eu/rest/v2/all");
  const json = await res.json();

  allCountries = json.map((country) => {
    const { numericCode, translations, population, flag } = country;

    return {
      id: numericCode,
      name: translations.pt,
      population,
      formattedPopulation: formatNumber(population),
      flag,
    };
  });

  render();
}

function render() {
  renderCountryList();
  renderFavorites();
  renderSummary();
  handleCountryButtons();
}

function renderCountryList() {
  let countriesHTML = "";

  allCountries.forEach((country) => {
    const { name, flag, id, formattedPopulation } = country;
    const countryHTML = `
      <div class='country'>
        <div>
          <a id='${id}' class='waves-effect waves-light btn'>+</a>
        </div>
          
        <div>
          <img src='${flag}' alt='${name}'>
        </div>

        <div>
          <ul>
            <li>${name}</li>
            <li>${formattedPopulation}</li>
          </ul>
        </div>
      </div>
    `;

    countriesHTML += countryHTML;
  });

  tabCountries.innerHTML = countriesHTML;
}

function renderFavorites() {
  let favoritesHTML = "";

  favoriteCountries.forEach((country) => {
    const { name, flag, id, formattedPopulation } = country;
    const favoriteCountryHTML = `
      <div class='country'>
        <div>
          <a id='${id}' class='waves-effect waves-light btn red darken-4'>-</a>
        </div>
          
        <div>
          <img src='${flag}' alt='${name}'>
        </div>

        <div>
          <ul>
            <li>${name}</li>
            <li>${formattedPopulation}</li>
          </ul>
        </div>
      </div>
    `;

    favoritesHTML += favoriteCountryHTML;
  });

  tabFavorites.innerHTML = favoritesHTML;
}

function renderSummary() {
  countCountries.textContent = allCountries.length
  countFavorites.textContent = favoriteCountries.length

  const totalPopulation = allCountries.reduce((acc, cur) => { 
    return acc + cur.population 
  }, 0)

  totalPopulationList.textContent = formatNumber(totalPopulation)

  const totalFavorites = favoriteCountries.reduce((acc, cur) => { 
    return acc + cur.population 
  }, 0)

  totalPopulationFavorites.textContent = formatNumber(totalFavorites)
}

function handleCountryButtons() {
  const countryButtons = Array.from(tabCountries.querySelectorAll('.btn'))
  const favoriteButtons = Array.from(tabFavorites.querySelectorAll('.btn'))

  countryButtons.forEach(button => {
    button.addEventListener('click', () => addToFavorites(button.id))
  })

  favoriteButtons.forEach(button => {
    button.addEventListener('click', () => removeFromFavorites(button.id))
  })
}

function addToFavorites(id) {
  const countryToAdd = allCountries.find(button => button.id === id)

  favoriteCountries = [...favoriteCountries, countryToAdd]
  
  favoriteCountries.sort((a,b) => {
    return a.name.localeCompare(b.name)
  })

  allCountries = allCountries.filter(country => country.id !== id)

  render()
}

function removeFromFavorites(id) {
  const countryToRemove = favoriteCountries.find(button => button.id === id)

  allCountries = [...allCountries, countryToRemove]
  
  allCountries.sort((a,b) => {
    return a.name.localeCompare(b.name)
  })

  favoriteCountries = favoriteCountries.filter(country => country.id !== id)

  render()
}

function formatNumber(number) {
  return numberFormat.format(number)
}