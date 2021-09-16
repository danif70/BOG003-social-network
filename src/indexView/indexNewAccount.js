import { register, emailVerification } from '../functionFirebase.js';
import { newAccount } from '../view/newAccount.js';

const cleanRegister = () => {
  document.querySelector('#nameUser').value = '';
  document.querySelector('#email').value = '';
  document.querySelector('#confirmEmail').value = '';
  document.querySelector('#password').value = '';
  document.querySelector('#confirmPassword').value = '';
};
export const functionNewAccount = () => {
  const divElement = document.createElement('div');
  divElement.innerHTML = newAccount();
  divElement.classList.add('divInitial');
  const inputLogin = divElement.querySelector('#signIn');

  const dataRegister = async () => {
    const nameUser = document.querySelector('#nameUser').value;
    const email = document.getElementById('email').value;
    const confirmEmail = document.getElementById('confirmEmail').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    /* eslint-disable */
    //console.log(email +''+ confirmEmail);
    //console.log(password + '' + confirmPassword);
    if (email.length !== 0 && confirmEmail.length !== 0 && password.length !== 0 && confirmPassword.length !== 0) {
      if (email === confirmEmail && password === confirmPassword) {
        await register(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          user.updateProfile({
            displayName: nameUser,
          })
          cleanRegister();
          window.location.href = '#/initial';
          emailVerification();
        })
        .catch((error) => {
          /* eslint-disable */
          var errorCode = error.code;
          console.log(errorCode);
          var errorMessage = error.message;
          console.log(errorMessage);
          switch (errorCode) {
            case 'auth/email-already-in-use': {
              document.getElementById('errorMessage').innerHTML = '❌ Usuario registrado, inicie sesión';
              break;
            }
            case 'auth/weak-password': {
              document.getElementById('errorMessage').innerHTML = '❌ La constraseña debe tener mas de 6 caracteres';
              break;
            }
            default: {
              document.getElementById('errorMessage').innerHTML = '❌ Por favor verifique el correo y contraseña';
              break;
            }
          }
          // ..
        });
      } else {
        document.getElementById('errorMessage').innerHTML = '⚠ Verifique el correo y contraseña';
      }
    } else {
      document.getElementById('errorMessage').innerHTML = '❌ Debe llenar todos los campos';
    }
  };



  inputLogin.addEventListener('click', () => {
    dataRegister();
  });

  return divElement;
}
