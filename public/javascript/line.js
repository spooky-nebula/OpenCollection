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

var orders = [];
//
socket.on('line update', function(data) {
  orders = data.orders;
  console.log(orders);
  if (orders.length == 0) {
    $('.line').innerHTML = "No orders"
    return false;
  } else {
    $('.line').innerHTML = "";
  }
  for (var i = 0; i < orders.length; i++) {
    let clone = $('#order').content.cloneNode(true);
    clone.querySelector('data').value = i;
    clone.querySelector('.name').innerHTML = orders[i].user.name;
    clone.querySelector('h3').innerHTML = 'Total: £' + orders[i].price;
    for (var j = 0; j < orders[i].cart.length; j++) {
      let item_clone = $('#item').content.cloneNode(true);
      item_clone.querySelector(".item_name").innerHTML = orders[i].cart[j].name;
      item_clone.querySelector(".special").innerHTML += orders[i].cart[j].special;
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
    $('.line').append(clone);
  }
});

function orderDone(element) {
  socket.emit('order done', {
    order_id: element.parentElement.querySelector('data').value
  });
  element.parentElement.querySelector('.order_done').classList.add('hidden');
  element.parentElement.querySelector('.order_remove').classList.remove('hidden');
}

function orderRemove(element) {
  socket.emit('order remove', {
    order_id: element.parentElement.querySelector('data').value
  });
}

socket.emit('line connected');