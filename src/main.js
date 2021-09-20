import { changeView } from './view-Controller/router.js';

const init = () => {
  changeView(window.location.hash);
  window.addEventListener('hashchange', () => changeView(window.location.hash));
};

window.addEventListener('load', () => {
  //window.location.hash = '#/initial';
  init();
});
