import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector(`#search-box`),
  listEl: document.querySelector(`.country-list`),
  countryEl: document.querySelector(`.country-info`),
};
console.log(refs.listEl);
console.log(refs.countryEl);

refs.inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const inputValue = e.target.value.trim();

  if (!inputValue) {
    clearMarkup();
    return;
  }

  fetchCountries(inputValue)
    .then(data => createEl(data))
    .catch(error => makeError());
}

function createEl(data) {
  if (data.length === 1) {
    createCountryEl(data);
    refs.listEl.innerHTML = '';
  }

  if (data.length >= 2 && data.length <= 10) {
    refs.countryEl.innerHTML = '';
    createListEl(data);
  }

  if (data.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    clearMarkup();
    return;
  }
}

function createListEl(arr) {
  const listMarkup = arr
    .map(
      ({
        name: { official },
        flags: { svg },
      }) => `<li class = "country-list_el">
<img src="${svg}" alt="The flag of ${official}" width="60px" height="40px">
<h2>${official}</h2>
</li>`
    )
    .join('');

  refs.listEl.innerHTML = listMarkup;
  refs.listEl.style.listStyle = 'none';
}

function createCountryEl(arr) {
  const countryMarkup = arr
    .map(
      ({
        name: { official },
        flags: { svg },
        capital,
        population,
        languages,
      }) => `<div class = "country">
<img src="${svg}" alt="The flag of ${official}" width="70px" height="50px">
<h1>${official}</h1></div>
<p class = "desc">Capital: ${capital}</p>
<p class = "desc">Population: ${population}</p>
<p class = "desc">Languages: ${Object.values(languages)}</p>`
    )
    .join('');

  refs.countryEl.innerHTML = countryMarkup;
}

function clearMarkup() {
  refs.listEl.innerHTML = '';
  refs.countryEl.innerHTML = '';
}

function makeError() {
  clearMarkup();
  Notify.failure('Oops, there is no country with that name');
}
