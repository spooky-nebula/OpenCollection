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
// Define the orders variables
var orders;
var old_orders;

function init() {
  console.info("Getting all orders");
  //
  o = '{"orders":' + o.replace(/\&quot;/g, '"') + '}';
  try {
    orders = JSON.parse(o).orders;
    console.info("Current orders found");
    if (orders.length == 0) {
      throw "No current orders found";
    }
    $(".orders").innerHTML = "";
  } catch (e) {
    orders = {
      orders: []
    };
    console.info("No current orders found");
  }
  //
  oo = '{"orders":' + oo.replace(/\&quot;/g, '"') + '}';
  try {
    old_orders = JSON.parse(oo).orders;
    console.info("Old orders found");
    $(".old_orders").innerHTML = "";
  } catch (e) {
    old_orders = {
      orders: []
    };
    console.info("No old orders found");
  }
  //
  for (var i = 0; i < orders.length; i++) {
    let clone = $('#order').content.cloneNode(true);
    clone.querySelector('.date').innerHTML = orders[i].stamp;
    clone.querySelector('.total').innerHTML = 'Total: £' + orders[i].price;
    if (orders[i].ready == true) {
      clone.querySelector(".order_status").innerHTML = "Ready for Pickup!"
    }
    for (var j = 0; j < orders[i].cart.length; j++) {
      let item_clone = $('#item').content.cloneNode(true);
      item_clone.querySelector("h3").innerHTML = orders[i].cart[j].name;
      let ingredientsString = " ";
      let saucesString = " ";
      let optionsString = " ";
      if (orders[i].cart[j].ingredients.length > 0) {
        for (let ingredient of orders[i].cart[j].ingredients) {
          ingredientsString += ingredient + ", ";
        }
        ingredientsString = ingredientsString.slice(0, ingredientsString.length - 2);
        item_clone.querySelector("p.ingredients").innerHTML += ingredientsString;
      } else {
        let parent_node = item_clone.querySelector('.ingredients').parentElement;
        let node = item_clone.querySelector('.ingredients');
        parent_node.removeChild(node);
      }
      if (orders[i].cart[j].sauces.length > 0) {
        for (let sauce of orders[i].cart[j].sauces) {
          saucesString += sauce + ", ";
        }
        saucesString = saucesString.slice(0, saucesString.length - 2);
        item_clone.querySelector("p.sauces").innerHTML += saucesString;
      } else {
        let parent_node = item_clone.querySelector('.sauces').parentElement;
        let node = item_clone.querySelector('.sauces');
        parent_node.removeChild(node);
      }
      if (orders[i].cart[j].options.length > 0) {
        for (let option of orders[i].cart[j].options) {
          optionsString += option + ", ";
        }
        optionsString = optionsString.slice(0, optionsString.length - 2);
        item_clone.querySelector("p.options").innerHTML += optionsString;
      } else {
        let parent_node = item_clone.querySelector('.options').parentElement;
        let node = item_clone.querySelector('.options');
        parent_node.removeChild(node);
      }
      clone.append(item_clone);
    }
    console.log(clone);
    $('.orders').append(clone);
  }
  for (var i = 0; i < old_orders.length; i++) {
    let clone = $('#order').content.cloneNode(true);
    clone.querySelector('h2').innerHTML = old_orders[i].stamp;
    clone.querySelector('h3').innerHTML = 'Total: £' + old_orders[i].price;
    let item_clone = $('#item').content.cloneNode(true);
    for (var j = 0; j < old_orders[i].cart.length; j++) {
      item_clone.querySelector("h3").innerHTML = old_orders[i].cart[j].name;
      for (let ingredient of old_orders[i].cart[j].ingredients) {
        item_clone.querySelector("p.ingredients").innerHTML += ingredient;
      }
      for (let sauce of old_orders[i].cart[j].sauces) {
        item_clone.querySelector("p.sauces").innerHTML += sauce;
      }
      for (let option of old_orders[i].cart[j].options) {
        item_clone.querySelector("p.options").innerHTML += option;
      }
    }
    console.log(clone);
    $('.old_orders').append(clone);
  }
}

socket.on('user update', function() {
  // Nothing to do here, still need to figure out a reliable way to update users
});

init();