const searchBtn = document.getElementById('btn-search');
const closeBtn = document.getElementById('close-btn');
const searchPanel = document.getElementById('search-panel');
const themeSwitcher = document.getElementById('theme-switcher');
const main = document.getElementById('App');

searchBtn.addEventListener('click', function () {
  searchPanel.classList.add('active');
});

closeBtn.addEventListener('click', function () {
  searchPanel.classList.remove('active');
});

themeSwitcher.addEventListener('click', function () {
  themeSwitcher.classList.toggle('dark');
  main.classList.toggle('dark-theme');
});
