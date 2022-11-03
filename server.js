const express = require("express");
const PORT = 8080;
const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const { faker } = require("@faker-js/faker");
const db = require("./config/firebase");
const { collection, addDoc, getDocs } = require("firebase/firestore");
const mensajesDB = collection(db, "mensajes");
const normalizr = require("normalizr");
const normalize = normalizr.normalize;
const schema = normalizr.schema;

const text = new schema.Entity("texts");

const author = new schema.Entity("author", {}, { idAttribute: "email" });
const mensajeSchema = new schema.Entity("mensajes", {
  id: "mensajes",
  mensajes: [author],
});

faker.setLocale("es");

const crearProducto = () => {
  const newProducto = {
    nombre: faker.commerce.productName(),
    precio: faker.commerce.price(10, 5000, 0),
    foto: "faker.image.business(640, 480)",
    id: faker.database.mongodbObjectId(),
  };
  return newProducto;
};

const crearProductos = (cantidad) => {
  let newListaProductos = [];
  for (let i = 0; i < cantidad; i++) {
    newListaProductos.push(crearProducto());
  }

  return newListaProductos;
};

const productos = crearProductos(5);

app.use(express.static("./public"));
app.use(express.json());
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.get("/api/test-productos", (req, res) => {
  res.send(productos);
});
let mensajes = [];
io.on("connection", async (socket) => {
  console.log("se conecto un usuario");
  await getDocs(mensajesDB)
    .then((docs) => {
      mensajes = docs.docs.map((doc) => doc.data());
    })
    .catch((error) => console.log(error));
  const dataNormalizada = normalize(mensajes, mensajeSchema);

  socket.emit("productos", productos);
  socket.emit("mensajes", dataNormalizada);
  socket.on("new-product", (data) => {
    productos.addProduct(data);
    io.sockets.emit("productos", productos);
  });
  socket.on("new-mensaje", async (mensaje) => {
    console.log(mensaje);

    const nuevoMsg = {
      author: {
        id: mensaje.author.id,
        nombre: mensaje.author.nombre,
        apellido: mensaje.author.apellido,
        edad: mensaje.author.edad,
        alias: mensaje.author.alias,
        avatar: mensaje.author.avatar,
      },
      text: mensaje.text,
    };

    await addDoc(mensajesDB, nuevoMsg).then(async (data) => {
      await getDocs(mensajesDB)
        .then((docs) => {
          mensajes = docs.docs.map((doc) => doc.data());
        })
        .catch((error) => console.log(error));

      io.sockets.emit("mensajes", mensajes);
    });

    io.sockets.emit("mensajes", mensajes);
  });
});
httpServer.listen(8080, () => console.log("servidor Levantado"));
