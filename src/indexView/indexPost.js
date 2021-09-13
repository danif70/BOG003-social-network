import { signOutDelicious } from '../functionFirebase.js';
import { post } from '../view/post.js';

export const functionPost = () => {
  const divElement = document.createElement('div');
  divElement.innerHTML = post();
  const buttonSignOut = divElement.querySelector('#signOut');
  const inputPostUser = divElement.querySelector('#inputPostear');
  const searchInput = divElement.querySelector('#searchInput');
  let enableEdit = true;
  document.addEventListener('DOMContentLoaded', async () => {
    /* eslint-disable */;
    loadPost();
  });

  buttonSignOut.addEventListener('click', () => {
    signOutDelicious()
      .then(() => {
        
        /* eslint-disable */
        window.location.href = '#/initial';
      }).catch((error) => {
      });
  });

  inputPostUser.addEventListener('click', async () => {
    divElement.querySelector('#containerPost').innerHTML = '';
    const recipe = divElement.querySelector('#recipePostear').value;
    const fecha = new Date();
    var db = firebase.firestore();
    const user = firebase.auth().currentUser;
    await db.collection("post").add({
      name: user.displayName,
      recipe: recipe,
      fecha: fecha,
      user: user.uid,
      like: [],
      })
      .then(() => {
          loadPost();
          divElement.querySelector('#recipePostear').value='';
      })
      .catch(() => {
          alert('Lo sentimos no pudimos agregar tu post, intenta de nuevo');
          divElement.querySelector('#recipePostear').value='';
      });
    });

  const loadPost = () => {
    const db = firebase.firestore();
    firebase.auth().onAuthStateChanged(user => {
      if(user){
        db.collection('post').orderBy('fecha', 'desc')
          .get()
          .then((snapshot) => {
            const helloUser = divElement.querySelector('#helloUser');
            helloUser.innerHTML = `Hola ${user.displayName}`; 
            showPost(snapshot.docs, user)
            searching();
          })
      }
    });
  }


  const showPost = (data, user) => {
    if(data.length){
      let addHtml = '';
      data.forEach(post => {
        const postData = post.data();
        const date = new Date(postData.fecha.seconds*1000)
        postData.fecha = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        const idPost = post.id;
        addHtml += createPost(postData, user, idPost);
      });
      divElement.querySelector('#containerPost').innerHTML='';
      divElement.querySelector('#containerPost').innerHTML=addHtml;
      editing();
      deliting();
      liking();
    }
  }

  const editing = () => {
    const inputEditar = divElement.querySelectorAll(".inputEditDesktop");
    //console.log('esto son los inputs ', inputEditar);
    inputEditar.forEach(editButton => {
      editButton.addEventListener('click',async (e)=>{
        if (enableEdit) {
          const textAreaBox = divElement.querySelector(`.${e.target.id}`);
          textAreaBox.disabled = false;
          divElement.querySelector(`#${e.target.id}`).value = "Guardar";
          enableEdit = false;
        }
        else {
          const editedPost = divElement.querySelector(`.${e.target.id}`).value;
          const db = firebase.firestore();
          const fecha = new Date();
          const date = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
          await db.collection("post").doc(`${e.target.id}`).update({recipe: editedPost, fecha: fecha,});
          enableEdit = true;
          loadPost();
        }
      })
    })
  }

    const confirmationDelete = () => {
      let delConfirm = confirm("¿Seguro quieres eliminar el post?");
        if( delConfirm == true ) {
          return true;
        } else {
          return false;
        }
    }

    const deliting = () => {
      const deleteButtons = divElement.querySelectorAll(".deleteDesktop");
      //console.log('esto son los delete ', deleteButtons);
      deleteButtons.forEach(deleteButton => {
        deleteButton.addEventListener('click',async (e)=>{
          if (confirmationDelete()=== true){
            const db = firebase.firestore();
            const idButtonDelete = e.target.dataset.id;
            await db.collection("post").doc(idButtonDelete).delete();
            loadPost();
          }
          else {
            loadPost(); 
          }
        })
      })
    }

    const liking = () => {
      const likesButtons = divElement.querySelectorAll("#likeImage");
      likesButtons.forEach(likeButton => {
        likeButton.addEventListener('click', async (e)=>{
          const db = firebase.firestore();
          const idButtonLike = e.target.dataset.id;
          const postLike = await db.collection("post").doc(idButtonLike).get();
          const likes =postLike.data().like;
          const user = firebase.auth().currentUser;
          if(likes.length>0){
            if(likes.includes(user.uid)){
              let newlikes=[];
              likes.forEach(item=>{
                if(item!==user.uid){
                  newlikes.push(item);
                }
              })
              await db.collection("post").doc(`${idButtonLike}`).update({like: newlikes});
            } else {
              likes.push(user.uid);
              await db.collection("post").doc(`${idButtonLike}`).update({like: likes});
            }
          } else {
            likes.push(user.uid);
            await db.collection("post").doc(`${idButtonLike}`).update({like: likes});
          }          
          loadPost(); 
        })
      })
    }
    
  const createPost = (data, user, idPost) => {
    let template = '';
    if(data.user===user.uid){
      template = `
      <div class= "containerPost">
      <div class= "userContainerPost">
          <div class="headerPost">
            <p class="postName postNameDesktop">${data.name}</p>
            <p class="datePost datePostDesktop">${data.fecha}</p>
            <input id= "${idPost}" class="inputEdit inputEditDesktop" type="button" value="Editar"/>
          </div>
           <textarea class = "textAreaGray ${idPost}" cols="10" rows="5" disabled>${data.recipe}</textarea>
          <div class="footerPost">
            <img data-id="${idPost}" class="like likeDesktop" src="./images/like.png" alt="">
            <p class='countLike'>${data.like.length}</p>
            <img data-id="${idPost}" class="delete deleteDesktop" src="./images/delete.png" type="button" alt="" />
          </div>
          </div>
      </div>
      `;
    } else {
      template = `
        <div class= "containerPost">
          <div class="headerPost">
            <p class="postName postNameDesktop">${data.name}</p>
            <p class="datePost datePostDesktop">${data.fecha}</p>
          </div>
           <textarea class=textAreaGray cols="10" rows="5" disabled>${data.recipe}</textarea>
          <div class="recipe">
          </div>
          <div class="footerPost">
            <img data-id="${idPost}" id="likeImage"class="like" src="./images/like.png" alt="">
            <p class='countLike'>${data.like.length}</p>
          </div>
        </div>
      `
    }
    return template;
  }
const searching = () => {
  searchInput.addEventListener('keyup', async (e) => {
   let search = e.target.value;
   const postBuscados = await firebase.firestore().collection('post').orderBy('fecha', 'desc').get();
   const postsShearch =[];
   postBuscados.docs.forEach(post=>{
     if(post.data().recipe.toLowerCase().includes(search.toLowerCase())){
       postsShearch.push(post);
     }
    
   })
   const user=firebase.auth().currentUser;
   if(postsShearch.length>0){
    showPost(postsShearch, user);
   }   
   });
  }
  return divElement;
}