module.exports = class Api {
  constructor(productos) {
    this.productos = productos;
  }

  getAllProducts() {
    return this.productos;
  }

  getProduct(id) {
    let target = this.productos.filter(
      (product) => product.id === parseInt(id)
    )[0];
    console.log(target);
    if (target === undefined) {
      return false;
    } else {
      return target;
    }
  }

  addProduct(item) {
    this.productos.push({
      id: item.id || this.productos.length + 1,
      name: item.name,
      price: item.price,
      thumbnail: item.thumbnail,
    });
    let newItem = this.productos.slice(-1);
    return newItem[0];
  }

  editProduct(id, item) {
    let target = this.getProduct(parseInt(id));

    target.name = item.name;
    target.price = item.price;
    target.thumbnail = item.thumbnail;
    return target;
  }

  deleteProduct(id) {
    let todos = this.getAllProducts();

    let index = todos
      .map((x) => {
        return x.id;
      })
      .indexOf(parseInt(id));
    if (index === -1) {
      return false;
    } else {
      let deletedItem = this.productos.splice(index, 1);

      return deletedItem[0];
    }
  }
};

/* api.addProduct({
  name: "Monitor",
  price: 12000,
  thumbnail: "https://www.google.com.ar",
});
api.addProduct({
  name: "Notebook",
  price: 8000,
  thumbnail: "https://www.google.com.ar",
});
api.addProduct({
  name: "Smart TV",
  price: 22000,
  thumbnail: "https://www.google.com.ar",
}); */

/* console.log(api.getAllProducts()); */

/* api.deleteProduct(2); */

/* console.log(api.getAllProducts()); */

/* api.editProduct(1, {
  name: "PRODUCTO EDITADO",
  price: 8000000000,
  thumbnail: "https://www.google.com.ar",
});

console.log(api.getAllProducts());
 */
/* 
prod.addProduct({
  name: "ALGO",
  price: 22000,
  thumbnail: "https://www.google.com.ar",
});
prod.addProduct({
  name: "ALGO 2",
  price: 22000,
  thumbnail: "https://www.google.com.ar",
});

console.table(prod.getProduct(1));
 */
