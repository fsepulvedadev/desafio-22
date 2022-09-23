const express = require("express");
const PORT = 8080;
const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const Api = require("./api.js");

const productos = new Api([
  {
    id: 1,
    name: "Lavarropas samsung ",
    price: 12000,
    thumbnail:
      "https://cdnlaol.laanonimaonline.com/web/images/productos/b/0000008000/8216.jpg",
  },
  {
    id: 2,
    name: "Monitor Daewoo",
    price: 14000,
    thumbnail:
      "https://medias.musimundo.com/medias/00349000-142673-142673-01-142673-01.jpg-size515?context=bWFzdGVyfGltYWdlc3wzODIxMnxpbWFnZS9qcGVnfGgzNy9oNmQvMTAzODAzNTMyMDgzNTAvMDAzNDkwMDAtMTQyNjczLTE0MjY3M18wMS0xNDI2NzNfMDEuanBnX3NpemU1MTV8OWRlMjYwNTJiZjNkN2YyYjM4Njg5YTgyZDhlMmRmNzc5YWQ4ZjIxZGNkYjhjYTZjMmFmNjNiNWNjNzIwM2VlNg",
  },
  {
    id: 3,
    name: "Heladera Samsung",
    price: 18000,
    thumbnail:
      "https://medias.musimundo.com/medias/00230125-177725-177725-01.png-177725-01.png-size515?context=bWFzdGVyfGltYWdlc3wyMzc1NjJ8aW1hZ2UvcG5nfGg0MS9oYWMvMTAzNzkwNjc5ODE4NTQvMDAyMzAxMjUtMTc3NzI1LTE3NzcyNV8wMS5wbmctMTc3NzI1XzAxLnBuZ19zaXplNTE1fGI2YzllYmU5YmQ3YTg5NzY4YTM3YTk2YjY0NzFiYzBkYmIwNDk2NDMyODU2ZjgyMGUyOTgwM2NhNTkwNjBlNGY",
  },
  {
    id: 4,
    name: "Heladera Samsung",
    price: 18000,
    thumbnail:
      "15?context=bWFzdGVyfGltYWdlc3wyMzc1NjJ8aW1hZ2UvcG5nfGg0MS9oYWMvMTAzNzkwNjc5ODE4NTQvMDAyMzAxMjUtMTc3NzI1LTE3NzcyNV8wMS5wbmctMTc3NzI1XzAxLnBuZ19zaXplNTE1fGI2YzllYmU5YmQ3YTg5NzY4YTM3YTk2YjY0NzFiYzBkYmIwNDk2NDMyODU2ZjgyMGUyOTgwM2NhNTkwNjBlNGY",
  },
]);

app.use(express.static("./public"));
app.use(express.json());
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.get("/productos", (req, res) => {
  res.send(productos.getAllProducts());
});
const fecha = new Date();
const mensajes = [
  {
    author: "Juan",
    text: "Hola que tal",
    date: `${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()}`,
    hour: `${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`,
  },
  {
    author: "Maria",
    text: "Bien y vos?",
    date: `${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()}`,
    hour: `${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`,
  },
  {
    author: "Juan",
    text: "Me alegra",
    date: `${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()}`,
    hour: `${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`,
  },
];
io.on("connection", (socket) => {
  console.log("se conecto un usuario");
  socket.emit("productos", productos.getAllProducts());
  socket.emit("mensajes", mensajes);
  socket.on("new-product", (data) => {
    productos.addProduct(data);
    io.sockets.emit("productos", productos.getAllProducts());
  });
  socket.on("new-mensaje", (mensaje) => {
    mensajes.push({
      author: mensaje.author,
      text: mensaje.text,
      date: `${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()}`,
      hour: `${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`,
    });
    io.sockets.emit("mensajes", mensajes);
  });
});
httpServer.listen(8080, () => console.log("servidor Levantado"));
