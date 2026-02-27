// cart.js
function filterCartItems(cart, itemName) {
  return cart.filter((item) => item.name === itemName);
}

module.exports = { filterCartItems };
