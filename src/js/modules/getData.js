import { startDownloadData } from './render.js';

const searchForm = document.forms.searchCityForm;
const btnSearchCity = document.getElementById('btn-search-city');
const APY_KEY = 'YOUR_API_KEY on the openweathermap.org';
let cityName = 'Москва';
let cityDataUrl = `https://nominatim.openstreetmap.org/search.php?q=${cityName}&format=json&addressdetails=1&limit=1`;

const getData = async (url) => {
  try {
    const cityData = await fetch(url);
    if (!cityData.ok) {
      console.error(cityData.status);
      return false;
    }

    return await cityData.json();
  } catch (error) {
    console.error(error);
    return false;
  }
};

btnSearchCity.addEventListener('click', (e) => {
  e.preventDefault();
  const inputValue = new FormData(searchForm);
  cityName = inputValue.get('searchCity');
  cityDataUrl = `https://nominatim.openstreetmap.org/search.php?q=${cityName}&format=json&addressdetails=1&limit=1`;
  startDownloadData();
  searchForm.reset();
});

export { APY_KEY, cityName, cityDataUrl, getData };
