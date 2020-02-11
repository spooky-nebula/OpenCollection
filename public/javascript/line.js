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
      let itemclone = $('#item').content.cloneNode(true);
      itemclone.querySelector(".itemname").innerHTML = orders[i].cart[j].name;
      itemclone.querySelector(".special").innerHTML += orders[i].cart[j].special;
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
    $('.line').append(clone);
  }
});

function orderdone(element) {
  socket.emit('order done', {
    orderid: element.parentElement.querySelector('data').value
  });
  element.parentElement.querySelector('.orderdone').classList.add('hidden');
  element.parentElement.querySelector('.orderremove').classList.remove('hidden');
}

function orderremove(element) {
  socket.emit('order remove', {
    orderid: element.parentElement.querySelector('data').value
  });
}

socket.emit('line connected');