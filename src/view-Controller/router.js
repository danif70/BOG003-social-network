import view from '../indexView/index.js';

export const changeView = (route) => {
  const container = document.getElementById('container');
  container.innerHTML = '';
  switch (route) {
    case './src/index.html':
      container.appendChild(view.initial);
      break;
    case '#/initial':
      container.appendChild(view.initial);
      break;
    case '#/newAccount':
      container.appendChild(view.newAccount);
      break;
    case '#/post':
      container.appendChild(view.post);
      break;
    default:
      container.appendChild(view.errors);
      break;
  }
};
