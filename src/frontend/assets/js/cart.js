function transformDotsToComma(value) {
  console.log(typeof value);
  return value.replace(/\./g, ",");
}

export function formatValue(value) {
  const newValue = Number(value)
  if (Math.floor(value) === value) {
    return transformDotsToComma(newValue.toFixed(2)); // Número inteiro, formata com duas casas decimais
  } else {
    return transformDotsToComma(newValue.toFixed(2)); // Número com casas decimais, formata com duas casas decimais
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const cart = document.querySelector(".cart");
  const cartList = document.querySelector(".cart-list");
  const cartUrl = "http://localhost:3000/orders";
  let cartItems = [];
  console.log(cartList);

  function fetchCart() {
    fetch(cartUrl)
      .then((response) => response.json())
      .then((data) => {
        cartItems.push(...data);

        renderCart();
      })
      .catch((error) => {
        console.log("Erro ao obter o menu:", error);
      });
  }

  function renderCart() {
    const cartListItems = cartItems.map((product) => {
      return `
      <li class="cart-list-item">
        <div class="product-info">
          <div class="name-product" data-js-product-value="${
            product.value_product
          }">
            <h2>${product.name_product}</h2>
            <span>${product.description}</span>
          </div>
          <div class="add-quantity-product-cart">
            <div>
              <input type="text" class="value-quantity" value=0 readonly/>
              <button value="" id="addQuantity">+</button>
              </div>
                <h3 class="product-total-value"><span>R$</span>${formatValue(
                  product.value_product
                )}</h3>
            </div>
        </div>
        <div class="product-image" style="background-image: url('${
          product.image
        }')">
        </div>
      </li>
      `;
    });

    cartList.innerHTML = cartListItems.join("");
  }

  fetchCart();
});
