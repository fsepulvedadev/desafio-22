const tablaProductos = document.getElementById("target");
const ventanaChat = document.getElementById("lista-mensajes");
const botonChat = document.getElementById("enviarChat");
const botonForm = document.getElementById("agregar");
const userName = document.getElementById("email");
const textoMensaje = document.getElementById("mensaje");
const nameForm = document.getElementById("name");
const priceForm = document.getElementById("price");
const urlForm = document.getElementById("url");
const errorEmail = document.getElementById("error-email");
const errorText = document.getElementById("texto-error");
const errorForm = document.getElementById("error-form");
const nombreChat = document.getElementById('nombreChat')
const apellidoChat = document.getElementById('apellido')
const edadChat = document.getElementById('edad')
const aliasChat = document.getElementById('alias')
const avatarChat = document.getElementById('avatar')
const date = new Date()
const fecha = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
const hora = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

window.addEventListener("load", () => {
  botonChat.addEventListener("click", enviarMensaje);
});
const socket = io();

console.log(target);

const render = (data, tipo) => {
  console.log(data)
  if (tipo === "chat") {
    var templateChat = Handlebars.compile(`
    {{#each mensajes}}
    {{#if yo}}
    <div>De: <span class="fw-bold text-danger">{{author.nombre}} {{author.apellido}} </span> <span style="color:#D27D2D">[${fecha} ${hora}] :</span>
            <span class="fst-italic text-success">{{text}}</span> 
             </div>
             {{else}}
             <div>De: <span class="fw-bold text-primary">{{author.nombre}} {{author.apellido}} </span> <span style="color:#D27D2D">[${fecha} ${hora}] :</span>
            <span class="fst-italic text-success">{{text}}</span> 
             </div>
             {{/if}}
             {{/each}}
    `);

    ventanaChat.innerHTML = templateChat({ mensajes: data });
  } else if (tipo === "productos") {
    var templateProductos = Handlebars.compile(
      `
                  {{#each items}}
                  <tr>
                      <th scope="row">{{id}}</th>
                    <td>{{nombre}}</td>
                    <td>{{precio}}</td>
                    <td class="p-3 d-flex justify-content-center">
                        <img
          onerror="this.onerror=null;this.src='https://via.placeholder.com/250?text=No+se+pudo+cargar+la+imagen';"
          class="w-25 h-25"
          src={{foto}}
          alt="imagen de producto"
        />
                        </td>
                        </tr>
                        {{/each}}
                        `
    );

    tablaProductos.innerHTML = templateProductos({ items: data });
  }
};

fetch("http://localhost:8080/api/test-productos")
  .then((res) => res.json())
  .then((data) => {
    render(data);
  })
  .catch((error) => console.log(error));

const agregarProducto = (e) => {
  e.preventDefault();

  if (!nameForm.value || !priceForm.value || !urlForm.value) {
    errorForm.classList.remove("d-none");
    return;
  } else {
    errorForm.classList.add("d-none");

    let newItem = {
      name: nameForm.value,
      price: priceForm.value,
      url: urlForm.value,
    };

    socket.emit("new-product", newItem);

    nameForm.value = "";
    priceForm.value = "";
    urlForm.value = "";
  }
};
const enviarMensaje = (e) => {
  e.preventDefault();

  if (!userName.value) {
    errorEmail.classList.remove("d-none");
    errorText.innerText = "Ingrese su email para enviar mensajes.";
    setTimeout(() => {
      errorEmail.classList.add("d-none");
    }, 1500);
    return;
  } else if (!textoMensaje.value) {
    errorEmail.classList.remove("d-none");
    errorText.innerText = "Escriba un mensaje para enviar";
    setTimeout(() => {
      errorEmail.classList.add("d-none");
    }, 1500);
    return;
  }

  let newMensaje = {
    author:{
      id: userName.value,
      nombre: nombreChat.value,
      apellido: apellidoChat.value,
      edad: edadChat.value,
      alias: aliasChat.value,
      avatar: avatarChat.value
    } ,
    text: textoMensaje.value,
  };

  socket.emit("new-mensaje", newMensaje);

  textoMensaje.value = "";
};

socket.on("productos", (data) => {
  render(data, "productos");
});

socket.on("mensajes", (mensajes) => {
  if (userName.value) {
    mensajes.forEach((mensaje) => {
      if (mensaje.author === userName.value) {
        mensaje.author = "Yo";
        mensaje.yo = true;
      }
    });
    render(mensajes, "chat");
  } else {
    render(mensajes, "chat");
  }
});
