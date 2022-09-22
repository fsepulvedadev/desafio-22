const target = document.getElementById("target");
console.log(target);

const render = (data) => {
  var template = Handlebars.compile(
    `
                {{#each items}}
                <tr>
                    <th scope="row">{{id}}</th>
                  <td>{{name}}</td>
                  <td>{{price}}</td>
                  <td class="p-3 d-flex justify-content-center">
                      <img
        onerror="this.onerror=null;this.src='https://via.placeholder.com/250?text=No+se+pudo+cargar+la+imagen';"
        class="w-25 h-25"
        src={{thumbnail}}
        alt="imagen de producto"
      />
                      </td>
                      </tr>
                      {{/each}}
                      `
  );

  target.innerHTML = template({ items: data });
};

fetch("http://localhost:8080/productos")
  .then((res) => res.json())
  .then((data) => {
    render(data);
  })
  .catch((error) => console.log(error));

const socket = io();

window.addEventListener("load", () => {
  let boton = document.getElementById("agregar");
  boton.addEventListener("click", agregarProducto);
});
const agregarProducto = (e) => {
  e.preventDefault();
  const nameForm = document.getElementById("name");
  const priceForm = document.getElementById("price");
  const urlForm = document.getElementById("url");
  let newItem = {
    name: nameForm.value,
    price: priceForm.value,
    url: urlForm.value,
  };

  socket.emit("new-product", newItem);

  nameForm.value = "";
  priceForm.value = "";
  urlForm.value = "";
};

socket.on("productos", (data) => {
  render(data);
});
