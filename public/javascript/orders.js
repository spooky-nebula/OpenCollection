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

var orders;
var oldorders;

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
    oldorders = JSON.parse(oo).orders;
    console.info("Old orders found");
    $(".oldorders").innerHTML = "";
  } catch (e) {
    oldorders = {
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
      clone.querySelector(".orderstatus").innerHTML = "Ready for Pickup!"
    }
    for (var j = 0; j < orders[i].cart.length; j++) {
      let itemclone = $('#item').content.cloneNode(true);
      itemclone.querySelector("h3").innerHTML = orders[i].cart[j].name;
      let ingredientsString = " ";
      let saucesString = " ";
      let optionsString = " ";
      if (orders[i].cart[j].ingredients.length > 0) {
        for (let ingredient of orders[i].cart[j].ingredients) {
          ingredientsString += ingredient + ", ";
        }
        ingredientsString = ingredientsString.slice(0, ingredientsString.length - 2);
        itemclone.querySelector("p.ingredients").innerHTML += ingredientsString;
      } else {
        let parentnode = itemclone.querySelector('.ingredients').parentElement;
        let node = itemclone.querySelector('.ingredients');
        parentnode.removeChild(node);
      }
      if (orders[i].cart[j].sauces.length > 0) {
        for (let sauce of orders[i].cart[j].sauces) {
          saucesString += sauce + ", ";
        }
        saucesString = saucesString.slice(0, saucesString.length - 2);
        itemclone.querySelector("p.sauces").innerHTML += saucesString;
      } else {
        let parentnode = itemclone.querySelector('.sauces').parentElement;
        let node = itemclone.querySelector('.sauces');
        parentnode.removeChild(node);
      }
      if (orders[i].cart[j].options.length > 0) {
        for (let option of orders[i].cart[j].options) {
          optionsString += option + ", ";
        }
        optionsString = optionsString.slice(0, optionsString.length - 2);
        itemclone.querySelector("p.options").innerHTML += optionsString;
      } else {
        let parentnode = itemclone.querySelector('.options').parentElement;
        let node = itemclone.querySelector('.options');
        parentnode.removeChild(node);
      }
      clone.append(itemclone);
    }
    console.log(clone);
    $('.orders').append(clone);
  }
  for (var i = 0; i < oldorders.length; i++) {
    let clone = $('#order').content.cloneNode(true);
    clone.querySelector('h2').innerHTML = oldorders[i].stamp;
    clone.querySelector('h3').innerHTML = 'Total: £' + oldorders[i].price;
    let itemclone = $('#item').content.cloneNode(true);
    for (var j = 0; j < oldorders[i].cart.length; j++) {
      itemclone.querySelector("h3").innerHTML = oldorders[i].cart[j].name;
      for (let ingredient of oldorders[i].cart[j].ingredients) {
        itemclone.querySelector("p.ingredients").innerHTML += ingredient;
      }
      for (let sauce of oldorders[i].cart[j].sauces) {
        itemclone.querySelector("p.sauces").innerHTML += sauce;
      }
      for (let option of oldorders[i].cart[j].options) {
        itemclone.querySelector("p.options").innerHTML += option;
      }
    }
    console.log(clone);
    $('.oldorders').append(clone);
  }
}

socket.on('user update', function() {
  // Nothing to do here, still need to figure out a reliable way to update users
});

init();