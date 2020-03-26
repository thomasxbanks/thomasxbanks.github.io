const toggleTheme = () => {
  const currentTheme = document.body.dataset.theme;
  document.body.dataset.theme = currentTheme === 'light' ? 'dark' : 'light';
};

const init = () => {
  const button = document.querySelector('[data-toggle-theme]');
  button.addEventListener('click', toggleTheme);
};

export default init;
