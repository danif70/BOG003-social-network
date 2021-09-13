import { functionInitial } from './indexInitial.js';
import { functionPost } from './indexPost.js';
import { functionNewAccount } from './indexNewAccount.js';
import { functionErrors } from './indexError.js';
/* eslint-disable */
//aquí se crea un objeto con los archivos js de cada vista, para que cada archivo sea el que traiga cada plantilla(vista).

const view = {
  initial: functionInitial(),
  newAccount: functionNewAccount(),
  post: functionPost(),
  errors: functionErrors(),
};
export default view;
