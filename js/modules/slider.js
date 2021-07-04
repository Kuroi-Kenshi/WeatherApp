import { renderHourCards, renderDayCards } from './render.js';

const sliderTabs = document.querySelector('.weather-details__tabs');
const weeklyBtnSwitcher = document.getElementById('weather-details__week');
const hourlyBtnSwitcher = document.getElementById('weather-details__hourly');
const arrowPrev = document.querySelector('.arrow-prev');
const arrowNext = document.querySelector('.arrow-next');
const weatherSlider = document.querySelector('.weather-slider');

function switchSlides() {
  const weatherSliderItem = document.querySelector('.weather-slider__item');
  const constsliderItemWidth =
    getComputedStyle(weatherSliderItem).getPropertyValue('margin-right');
  const movePerClick =
    weatherSliderItem.offsetWidth + parseInt(constsliderItemWidth);

  arrowNext.addEventListener('click', () => {
    arrowPrev.disabled = false;
    arrowPrev.classList.remove('inactive');
    let scrolledRange = weatherSlider.scrollWidth - weatherSlider.clientWidth;
    if (weatherSlider.scrollLeft + movePerClick >= scrolledRange) {
      arrowNext.disabled = true;
      arrowNext.classList.add('inactive');
    }
    weatherSlider.scrollLeft += movePerClick;
  });

  arrowPrev.addEventListener('click', () => {
    arrowNext.disabled = false;
    arrowNext.classList.remove('inactive');
    if (weatherSlider.scrollLeft - movePerClick <= 0) {
      arrowPrev.disabled = true;
      arrowPrev.classList.add('inactive');
    } else {
      arrowPrev.disabled = false;
    }
    weatherSlider.scrollLeft -= movePerClick;
  });
}

function sliderSwitchTabs() {
  sliderTabs.addEventListener('click', (event) => {
    if (event.target.textContent === 'на неделю') {
      weatherSlider.scrollLeft = 0;
      event.target.classList.add('active');
      hourlyBtnSwitcher.classList.remove('active');
      arrowNext.classList.remove('inactive');
      arrowPrev.classList.add('inactive');
      arrowPrev.disabled = true;
      arrowNext.disabled = false;
      renderDayCards();
    }

    if (event.target.textContent === 'почасовой') {
      weatherSlider.scrollLeft = 0;
      event.target.classList.add('active');
      weeklyBtnSwitcher.classList.remove('active');
      arrowNext.classList.remove('inactive');
      arrowPrev.classList.add('inactive');
      arrowPrev.disabled = true;
      arrowNext.disabled = false;
      renderHourCards();
    }
  });
}

export { switchSlides, sliderSwitchTabs };
