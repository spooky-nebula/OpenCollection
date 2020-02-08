// Our fake jQuery
let $ = function(query) {
  let result = document.querySelectorAll(query);
  if (result.length === 0) {
    return;
  }
  if (result.length > 1) {
    return result;
  }
  result[0].forEach = function(callback) {
    if (callback) callback(result[0]);
  }
  return result[0];
};
// Define variables needed
var products;
var cart = [];

// Where the fuck is connnection itself my nigga?
// App.js is server-side

// yep

// var socket = io(); // Where's this? On client-side?

// yeah on order.html

// Show me the file

// Yeah it's open now, can't you see the file?

// Yeah, I can't see order.html

socket.emit('get products');

socket.on('gotten products', function(data) {
  products = data.products;
});

$('form').addEventListener("submit", function(e) {
  console.log("order sent");
  e.preventDefault(); // prevents page reloading
  socket.emit('order', {
    cart: cart
  });
  return false;
}, false);