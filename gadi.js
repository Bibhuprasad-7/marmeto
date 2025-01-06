const cartListEl = document.getElementById("cart-list");
const subtotalElement = document.getElementById("subtotal");
const totalElement = document.getElementById("total");
const itemCountElement = document.getElementById("cart-count");
const checkoutButton = document.getElementById("checkout");
const loaderElement = document.getElementById("loader");

const apiEndpoint = "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889";

let shoppingCart = [];

async function loadCartData() {
  try {
    loaderElement.style.display = "block";
    const response = await fetch(apiEndpoint);

    if (!response.ok) throw new Error("Failed to fetch cart data");

    const data = await response.json();
    shoppingCart = data.items || [];
    displayCart();
  } catch (error) {
    console.error("Error fetching cart data:", error);
    alert("Failed to load cart data. Please try again later.");
  } finally {
    loaderElement.style.display = "none";
  }
}

function displayCart() {
  cartListEl.innerHTML = "";
  let subtotal = 0;
  let totalItems = 0;

  if (shoppingCart.length === 0) {
    // If the cart is empty, display an "Add Item" button
    const addItemRow = document.createElement("tr");
    addItemRow.innerHTML = `
      <td colspan="5" style="text-align: center;">
        <button id="add-item-button" style="padding: 10px; background-color: #28a745; color: white; border: none; border-radius: 5px;">Add Item</button>
      </td>
    `;
    cartListEl.appendChild(addItemRow);

    // Handle adding item back to the cart
    document.getElementById("add-item-button").addEventListener("click", () => {
      addItemToCart(); // Call function to add item back to cart
    });

  } else {
    shoppingCart.forEach(item => {
      subtotal += item.price * item.quantity;
      totalItems += item.quantity;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${item.image}" alt="${item.title}" width="50">${item.title}</td>
        <td>₹${(item.price / 100).toFixed(2)}</td>
        <td><input type="number" min="1" value="${item.quantity}" data-id="${item.id}" class="quantity"></td>
        <td class="line-price" data-id="${item.id}">₹${((item.price * item.quantity) / 100).toFixed(2)}</td>
        <td><button data-id="${item.id}" class="remove-item" style="background-color: #b88e2f; color: white; border: none; padding: 5px 10px; border-radius: 4px;">🗑️</button></td>
      `;
      cartListEl.appendChild(row);
    });
  }

  subtotalElement.textContent = `₹${(subtotal / 100).toFixed(2)}`;
  totalElement.textContent = `₹${(subtotal / 100).toFixed(2)}`;
  itemCountElement.textContent = totalItems; 

  document.querySelectorAll(".quantity").forEach(input => {
    input.addEventListener("change", event => {
      const id = event.target.dataset.id;
      let newQuantity = parseInt(event.target.value);

      if (newQuantity < 1) {
        newQuantity = 1;
        event.target.value = 1;
      }

      const item = shoppingCart.find(item => item.id == id);

      if (item) {
        item.quantity = newQuantity;
      }

      displayCart();
    });
  });

  document.querySelectorAll(".remove-item").forEach(button => {
    button.addEventListener("click", event => {
      const id = event.target.dataset.id;
      shoppingCart = shoppingCart.filter(item => item.id != id);
      displayCart();
    });
  });
}

function addItemToCart() {
  // Example: Add a new item back to the cart. Replace with actual logic to fetch and add items
  const newItem = {
    id: "new-item-id",
    title: "Sample Item",
    price: 25000000, // 50.00 Rs
    quantity: 1,
    image: "https://via.placeholder.com/50"
  };

  shoppingCart.push(newItem);
  displayCart();
}

checkoutButton.addEventListener("click", () => {
  if (shoppingCart.length === 0) {
    alert("Your cart is empty. Add items to proceed to checkout.");
    return;
  }

  alert("Checkout confirmed. Thank you for your purchase!");
  shoppingCart = [];
  displayCart();
});

// Load cart data if it's empty
if (shoppingCart.length === 0) {
  loadCartData();
} else {
  displayCart();
}
