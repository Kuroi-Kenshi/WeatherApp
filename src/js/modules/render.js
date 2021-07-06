import { APY_KEY, cityDataUrl, cityName, getData } from './getData.js';
import { sliderSwitchTabs, switchSlides } from './slider.js';

const LOADER_ANIMATION = `
  <div class="loader active">
    <div class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
  </div>
`;

let weatherData = null;

const searchPanelLoader = document.querySelector('.search-loader');
const searchPanel = document.getElementById('search-panel');
const errorMessage = document.querySelector('.error-message');

function checkCityName(cityName) {
  const name = cityName.toLowerCase().split('');
  const arrCityName = [];
  for (let i = 0; i < name.length; i++) {
    if (i === 0 || name[i - 1] === '-' || name[i - 1] === ' ') {
      arrCityName.push(name[i].toUpperCase());
    } else {
      arrCityName.push(name[i]);
    }
  }
  return arrCityName.join('');
}

const renderTodayForcast = () => {
  const weatherConditions = document.querySelector('.weather-today__conditions');
  const todayDate = document.querySelector('.weather-today__date');
  const weatherLocation = document.querySelector('.weather-today__location');

  let date = new Date(weatherData.current.dt * 1000).toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  let weatherDescr = weatherData.current.weather[0].description;
  date = date[0].toUpperCase() + date.slice(1);
  weatherDescr = weatherDescr[0].toUpperCase() + weatherDescr.slice(1);

  const forcast = `
    <img src="http://openweathermap.org/img/wn/${
      weatherData.current.weather[0].icon
    }@4x.png" alt="condition" class="weather-today__conditions-img">
    <div class="weather-today__degrees">
        ${Math.round(weatherData.current.temp)} <span>&degC</span>
    </div>
    <div class="weather-today__conditions-descr">${weatherDescr}</div>
    <div class="weather-today__feels-like">Ощущается как ${Math.round(
      weatherData.current.feels_like
    )} &deg<span>C</span></div>
  `;
  weatherConditions.innerHTML = forcast;
  todayDate.innerHTML = `
    <div>Сегодня</div>
    <div>${date}</div>
`;
  weatherLocation.innerHTML = `
      <img src="./icons/location-pic.svg" alt="">
      <div id="city">${checkCityName(cityName)}</div>
  `;
};

const renderDayCards = () => {
  const weatherSliderContainer = document.getElementById(
    'weather-slider__container'
  );
  weatherSliderContainer.innerHTML = '';
  weatherData.daily.forEach((el, idx) => {
    if (idx > 0) {
      let date = new Date(el.dt * 1000).toLocaleDateString('ru-RU', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
      date = date[0].toUpperCase() + date.slice(1);

      let card = `
        <li class="weather-slider__item">
            <div class="weather-slider__item-title">${
              idx === 1 ? 'Завтра' : date
            }</div>
            <img src="http://openweathermap.org/img/wn/${
              el.weather[0].icon
            }@2x.png" alt="Weather Icon" class="weather-slider__item-img">
            <div class="weather-slider__item-degree">
                <div class="weather-slider__degree-max">${Math.round(
                  el.temp.max
                )} &degC</div>
                <div class="weather-slider__degree-min">${Math.round(
                  el.temp.min
                )} &degC</div>
            </div>
        </li>`;

      weatherSliderContainer.insertAdjacentHTML('beforeend', card);
    }
  });
};

const renderHourCards = () => {
  const weatherSliderContainer = document.getElementById(
    'weather-slider__container'
  );
  weatherSliderContainer.innerHTML = '';
  weatherData.hourly.forEach((el, idx) => {
    if (idx < 12) {
      let date = new Date(el.dt * 1000);
      date = date.getHours();
      let card = `
        <li class="weather-slider__item">
            <div class="weather-slider__item-title">${date}:00</div>
            <img src="http://openweathermap.org/img/wn/${
              el.weather[0].icon
            }@2x.png" alt="Weather Icon" class="weather-slider__item-img">
            <div class="weather-slider__item-degree">${Math.round(
              el.temp
            )} &degC</div>
        </li>`;

      weatherSliderContainer.insertAdjacentHTML('beforeend', card);
    }
  });
};

const getCardHTML = (internalHTML) =>
  `<div class="details__today-item">${internalHTML}</div>`;
const renderDetailCards = () => {
  const currentWindDeg = weatherData.current.wind_deg;

  let cards = `
    ${getCardHTML(`
        <div class="details__today-item__title">Скорость ветра</div>
        <div class="details__today-item__descr">${Math.round(
          weatherData.current.wind_speed
        )} <span>м/с</span></div>
        <div class="details__today-item__indicator">
            <div class="wind-route">
                <img src="./icons/wind-route.svg" alt="wind-route" class="wind-route-img" id="wind-route">
            </div>
            <div class="wind-route-text" id="wind-route-text"></div>
        </div>`)}
  ${getCardHTML(`
        <div class="details__today-item__title">Влажность</div>
        <div class="details__today-item__descr">${weatherData.current.humidity} <span>%</span></div>
        <div class="details__today-item__range">
            <div class="range">
                <div>0</div>
                <div>50</div>
                <div>100</div>
            </div>

            <div class="humidity-scale">
                <div class="humidity-scale__fill" id='humidity-scale__fill'></div>
            </div>
            <span>%</span>
        </div>`)}
    ${getCardHTML(`
        <div class="details__today-item__title">Видимость</div>
        <div class="details__today-item__descr">${Math.round(
          weatherData.current.visibility / 1000
        )} <span>км</span>
        </div>`)}
    ${getCardHTML(`
        <div class="details__today-item__title">Давление</div>
            <div class="details__today-item__descr">${weatherData.current.pressure} <span class="small-text">мм рт. ст.</span>
        </div>`)}
    `;
  const detailsToday = document.getElementById('details__today');

  detailsToday.innerHTML = cards;

  const windRoute = document.getElementById('wind-route');
  const windRouteText = document.getElementById('wind-route-text');
  windRouteText.textContent = degreesToDirection(currentWindDeg);
  windRoute.style.transform = `rotate(${currentWindDeg + 225}deg)`;
  document.getElementById(
    'humidity-scale__fill'
  ).style.width = `${weatherData.current.humidity}%`;
};

function degreesToDirection(degrees) {
  const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
  let i = 0;
  if (degrees > 22.5 && degrees <= 67.5) i = 1;
  if (degrees > 67.5 && degrees <= 112.5) i = 2;
  if (degrees > 112.5 && degrees <= 157.5) i = 3;
  if (degrees > 157.5 && degrees <= 202.5) i = 4;
  if (degrees > 202.5 && degrees <= 247.5) i = 5;
  if (degrees > 247.5 && degrees <= 292.5) i = 6;
  if (degrees > 292.5 && degrees <= 337.5) i = 7;
  return directions[i];
}

async function getWeatherData(url) {
  const cityData = await getData(url);
  if (cityData.length === 0) {
    renderErrorMessage(true);
  } else {
    renderErrorMessage(false);
    setLoader();
    const { lat, lon } = cityData[0];
    const weatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APY_KEY}&units=metric&lang=ru`;
    let data = await getData(weatherApi);
    weatherData = data;
    renderData();
    searchPanel.classList.remove('active');
  }
}

function renderErrorMessage(visibility) {
  if (visibility) {
    errorMessage.classList.add('active');
  } else {
    errorMessage.classList.remove('active');
  }
}

function startDownloadData() {
  getWeatherData(cityDataUrl);
}

export async function setLoader() {
  const detailsTodayItem = document.querySelectorAll('.details__today-item');
  const weatherSliderItem = document.querySelectorAll('.weather-slider__item');
  const weatherTodayDate = document.querySelector('.weather-today__date');

  searchPanelLoader.classList.add('active');
  weatherTodayDate.innerHTML = LOADER_ANIMATION;

  detailsTodayItem.forEach((el) => {
    el.innerHTML = LOADER_ANIMATION;
  });

  weatherSliderItem.forEach((el) => {
    el.innerHTML = LOADER_ANIMATION;
  });
}

function removeSearchPanelLoader() {
  searchPanelLoader.classList.remove('active');
}

async function renderData() {
  renderDetailCards();
  renderDayCards();
  renderTodayForcast();

  switchSlides();
  sliderSwitchTabs();
  removeSearchPanelLoader();
}

export { startDownloadData, renderDayCards, renderHourCards };
