import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;


const searchCount = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchCount.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
  evt.preventDefault();
  const searchCountryValue = searchCount.value.trim();
  fetchCountries(searchCountryValue)
    .then(returnedCountries)
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
    });
}

function oneCountryInfo({ flags, name, capital, population, languages }) {
  return `
      <div class="container">
        <div class="box">
          <img class="img" src="${flags.svg}" alt="${
    name.official
  }" width="100" />
          <h2 class="name">${name.official}</h2>
        </div>
        <p class="capital"><span class="country-info__weight">Capital:</span> ${capital}</p>
        <p class="population"><span class="country-info__weight">Population:</span> ${population}</p>
        <p class="languages"><span class="country-info__weight">Languages:</span> ${Object.values(
          languages
        )}</p>
      </div>
    `;
  
}

function oneCountryList({ flags, name }) {
  return `
    <li class="list-item">
      <img class="list-item__img" src="${flags.svg}" alt="${name.official}" width="200" />
      <h2 class="list-item__name">${name.official}</h2>
    </li>
    `;
}

function returnedCountries(countries) {
  if (countries.status === 404) {
    Notify.failure('Oops, there is no country with that name');
  }
  if (countries.length >= 2 && countries.length < 10) {
    const markup = countries.map(country => oneCountryList(country));
    countryList.innerHTML = markup.join('');
    countryInfo.innerHTML = '';
  }
  if (countries.length === 1) {
    const markup = countries.map(country => oneCountryInfo(country));
    countryInfo.innerHTML = markup.join('');
    countryList.innerHTML = '';
  }
  if (countries.length >= 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
}
































// const refs = {
//   input: document.querySelector('#search-box'),
//   list: document.querySelector('.country-list'),
//   info: document.querySelector('.country-info'),
// };

// refs.input.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY));

// function onCountryInput() {
//   const countryName = refs.input.value.trim();

//   if (!countryName) {
//     refs.info.innerHTML = '';
//     refs.list.innerHTML = '';
//   }

//   fetchCountries(countryName)
//     .then(countries => {
//       if (countries.length > 10) {
//         refs.list.innerHTML = '';
//         refs.info.innerHTML = '';
//         alertTooManyMatches();
//       } else if (countries.length === 1) {
//         refs.list.innerHTML = '';
//         refs.info.innerHTML = onCountryMarkup(countries);
//       } else {
//         refs.info.innerHTML = '';
//         refs.list.innerHTML = onCountiesListMarkup(countries);
//       }
//     })
//     .catch(alertWrongName);
// }

// function onCountryMarkup(country) {
//   return country
//     .map(
//       ({ name, capital, population, flags, languages }) =>
//         `<div class = "country-item" style="
//         display: flex;
//         align-items: center;
//         gap: 15px;"><img src="${flags.svg}" alt="${
//           name.official
//         }" width='64' height = '40'>
//         <h1 class="country-text">${name.official}</h1></div>
//         <p class="country-text-info"><span style="
//         font-weight: 700;">Capital: </span>${capital}</p>
//         <p class="country-text-info"><span style="
//         font-weight: 700;">Population: </span>${population}</p>
//         <p class="country-text-info"><span style="
//         font-weight: 700;">Languages: </span>${Object.values(languages)} </p>
//         `
//     )
//     .join('');
// }

// function onCountiesListMarkup(countries) {
//   return countries
//     .map(
//       ({ name, flags }) =>
//         `<li class="country-item" style="
//         display: flex;
//         align-items: center;
//         gap: 15px;
//         list-style: none;
//         margin-left: -40px"><img src="${flags.svg}" alt="${name.official}" width='32'>
//         <p class="country-text" style="
//         margin: 5px 0 5px 0;">${name.official}</p></li>`
//     )
//     .join('');
// }

// function alertTooManyMatches() {
//   Notify.info('Too many matches found. Please enter a more specific name.');
// }

// function alertWrongName() {
//   Notify.failure('Oops, there is no country with that name');
// }


