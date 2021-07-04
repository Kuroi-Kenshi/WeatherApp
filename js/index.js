import { startDownloadData } from './modules/render.js';

const searchBtn = document.getElementById('btn-search');
const searchCloseBtn = document.getElementById('close-btn');
const searchPanel = document.getElementById('search-panel');
const themeSwitcher = document.getElementById('theme-switcher');
const main = document.getElementById('App');

searchBtn.addEventListener('click', () => {
  searchPanel.classList.add('active');
});

searchCloseBtn.addEventListener('click', () => {
  searchPanel.classList.remove('active');
});

themeSwitcher.addEventListener('click', () => {
  themeSwitcher.classList.toggle('dark');
  main.classList.toggle('dark-theme');
});

startDownloadData();
