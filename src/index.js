import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
// import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY));

function onCountryInput() {
  const countryName = refs.input.value.trim();

  if (!countryName) {
    refs.info.innerHTML = '';
    refs.list.innerHTML = '';
  }

  fetchCountries(countryName)
    .then(countries => {
      if (countries.length > 10) {
        refs.list.innerHTML = '';
        refs.info.innerHTML = '';
        alertTooManyMatches();
      } else if (countries.length === 1) {
        refs.list.innerHTML = '';
        refs.info.innerHTML = onCountryMarkup(countries);
      } else {
        refs.info.innerHTML = '';
        refs.list.innerHTML = onCountiesListMarkup(countries);
      }
    })
    .catch(alertWrongName);
}

function onCountryMarkup(country) {
  return country
    .map(
      ({ name, capital, population, flags, languages }) =>
        `<div class = "country-item" style="
        display: flex;
        align-items: center;
        gap: 15px;"><img src="${flags.svg}" alt="${
          name.official
        }" width='64' height = '40'>
        <h1 class="country-text">${name.official}</h1></div>
        <p class="country-text-info"><span style="
        font-weight: 700;">Capital: </span>${capital}</p>
        <p class="country-text-info"><span style="
        font-weight: 700;">Population: </span>${population}</p>
        <p class="country-text-info"><span style="
        font-weight: 700;">Languages: </span>${Object.values(languages)} </p>
        `
    )
    .join('');
}

function onCountiesListMarkup(countries) {
  return countries
    .map(
      ({ name, flags }) =>
        `<li class="country-item" style="
        display: flex;
        align-items: center;
        gap: 15px;
        list-style: none;
        margin-left: -40px"><img src="${flags.svg}" alt="${name.official}" width='32'>
        <p class="country-text" style="
        margin: 5px 0 5px 0;">${name.official}</p></li>`
    )
    .join('');
}

function alertTooManyMatches() {
  Notify.info('Too many matches found. Please enter a more specific name.');
}

function alertWrongName() {
  Notify.failure('Oops, there is no country with that name');
}


