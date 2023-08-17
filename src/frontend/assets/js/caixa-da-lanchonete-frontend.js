async function getOrders() {
  try {
    const response = await fetch("http://localhost:3000/orders");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar os pedidos:", error);
    return [];
  }
}

function transformDotsToComma(value) {
  return value.replace(/\./g, ",");
}

export function formatValue(value) {
  if (Math.floor(value) === value) {
    return transformDotsToComma(value.toFixed(2)); // Número inteiro, formata com duas casas decimais
  } else {
    return transformDotsToComma(value.toFixed(2)); // Número com casas decimais, formata com duas casas decimais
  }
}

//nao esquece de criar uma função pra diminuir a quantidade kirida

document.addEventListener("DOMContentLoaded", () => {

  const selectPaymentForm = document.querySelector("#selectPaymentForm");
  const listProducts = document.querySelector("#listProducts");
  const cart = document.querySelector(".cart");
  let menu = [];
  const menuUrl = "http://localhost:3000/menu"; // Atualize a URL de acordo com a configuração do seu servidor

  function fetchMenu() {
    fetch(menuUrl)
      .then((response) => response.json())
      .then((data) => {
        menu.push(...data);
        renderMenu();
      })
      .catch((error) => {
        console.log("Erro ao obter o menu:", error);
      });
  }


  function renderMenu() {
    const menuItems = menu.map((product) => {
      return `
        <li class="list-product">
          <div class="product-image" style="background-image: url('${
            product.image
          }')">
          </div>
          <div class="name-product" data-js-product-value="${
            product.value_product
          }">
            <h2>${product.name_product}</h2>
          </div>
          <div class="add-quantity-product">
            <h3 class="product-total-value"><span>R$</span>${formatValue(
              product.value_product
            )}</h3>
            <div>
              <input type="text" class="value-quantity" value=0 readonly/>
              <button value="" id="addQuantity">+</button>
            </div>
          </div>
          <button class="add-product-to-cart" value=${product.id}>ADD</button>
        </li>
      `;
    });

    listProducts.innerHTML = menuItems.join("");
  }

  fetchMenu();

  function showToast(message) {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "bottom",
      position: "left",
    }).showToast();
  }

  async function isProductInCart(productId) {
    const orders = await getOrders();
    return orders.some((order) => order.id === productId);
  }

  async function findCartItem(productId) {
    const orders = await getOrders();
    return orders.find((item) => item.id === productId);
  }

  async function updateCartItemQuantity(productId, newQuantity) {
    const cartItem = await findCartItem(productId);
    if (cartItem) {
      if (cartItem.quantity !== newQuantity) {
        cartItem.quantity = newQuantity;
        await updateCartItemQuantityOnServer(productId, newQuantity);
      }
    }
  }

  async function updateCartItemQuantityOnServer(productId, newQuantity) {
    try {
      const response = await fetch(
        `http://localhost:3000/update-cart-item/${productId}`,
        {
          method: "POST", // Ou PUT, dependendo da sua implementação no servidor
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Erro ao atualizar a quantidade no servidor:", error);
    }
  }

  async function addNewProductToCart(productId, quantity) {
    const isOnCart = await isProductInCart(productId);
    if (isOnCart) {
      const cartItem = await findCartItem(productId);
      if (cartItem && cartItem.quantity !== quantity) {
        await updateCartItemQuantity(productId, quantity);
        showToast("Quantidade atualizada no carrinho");
      } else {
        showToast("Esse produto já está no carrinho!");
      }
    }
    const newProduct = menu.find((item) => item.id === productId);
    if (newProduct.extra !== null) {
      if (newProduct.extra.includes("café")) {
        showToast(
          "Para adicionar esse produto, precisa adicionar primeiro o café!"
        );
        return;
      } else if (newProduct.extra.includes("sanduiche")) {
        showToast(
          "Para adicionar esse produto, precisa adicionar primeiro o café!"
        );
        // Realiza ação para o caso de extra com "chantily"
      }
    } else {
      newProduct.quantity = quantity;
      fetch("http://localhost:3000/add-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.log("Erro ao adicionar o pedido: ", error);
        });
    }
  }

  listProducts.addEventListener("click", (event) => {
    if (event.target.className === "add-product-to-cart") {
      const quantityInput =
        event.target.parentNode.querySelector(".value-quantity");
      const quantity = parseInt(quantityInput.value);

      if (isNaN(quantity) || quantity <= 0) {
        showToast("Adicione um item ao carrinho.");
        return;
      }

      addNewProductToCart(Number(event.target.value), quantity);
    } else if (event.target.id === "addQuantity") {
      handleQuantityItems(event.target.parentNode);
    } else {
      return;
    }
  });

  function setTotalValue(quantityValue, quantityElement) {
    const quantityValueElement = quantityElement.parentNode;
    const listItem = quantityValueElement.parentNode;
    const productValueElement = listItem.querySelector(".name-product");
    const productValue = productValueElement.getAttribute(
      "data-js-product-value"
    );
    const newTotalValue = quantityValue * Number(productValue);
    const buttonAddValue = listItem.querySelector("#addQuantity");
    buttonAddValue.setAttribute("value", newTotalValue);
    listItem.querySelector(".product-total-value").innerText = `R$${formatValue(
      newTotalValue
    )}`;
  }

  function handleQuantityItems(listItem) {
    const quantityElement = listItem.querySelector(".value-quantity");
    const newQuantityProduct =
      Number(quantityElement.getAttribute("value")) + 1;
    quantityElement.setAttribute("value", newQuantityProduct);
    setTotalValue(newQuantityProduct, listItem);
  }

  listProducts.innerHTML += menu
    .map((product) => {
      return `          
          <li class="list-product">
            <div class="product-image" style="background-image: url('${
              product.image
            }')">
            </div>
            <div class="name-product" data-js-product-value="${product.value}">
              <h2>${product.nameProduct}</h2>
            </div>
            <div class="add-quantity-product">
              
                <h3 class="product-total-value"><span>R$</span>${formatValue(
                  product.value
                )}</h3>
             
              <div>
                <input type="text" class="value-quantity" value=0 readonly/>
                <button value="" id="addQuantity">+</button>
              </div>
            </div>
            <button class="add-product-to-cart" value=${product.id}>ADD</button>
          </li>
        `;
    })
    .join("");
});
