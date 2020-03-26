import displayProjects from './modules/projects';
import toggleTheme from './modules/toggle-theme';

const lang = navigator.language || navigator.language || 'en-GB';
const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'CET';

document.documentElement.lang = lang;
document.documentElement.setAttribute('tz', tz);

const init = async () => {
  console.log('init');
  displayProjects();
  toggleTheme();
};

window.onload = init;
