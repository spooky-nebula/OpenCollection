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
var cart = {
  items: [],
  price: 0
};


function init() {
  socket.emit('get products');

  socket.on('gotten products', function(data) {
    products = data.products;
    let types = [];
    for (var i = 0; i < products.length; i++) {
      if (products[i].type != types[types.length - 1]) {
        types.push(products[i].type);
      }
    }
    for (var i = 0; i < types.length; i++) {
      let clone = $('#category').content.cloneNode(true);
      clone.querySelector('h2').innerHTML = types[i];
      for (var j = 0; j < products.length; j++) {
        if (products[j].type == types[i]) {
          let item_clone = $('#item').content.cloneNode(true);
          item_clone.querySelector('h3').innerHTML = products[j].name;
          item_clone.querySelector('img').src = '/assets/' + products[j].image;
          if (products[j].available) {
            item_clone.querySelector('data').value = j;
            item_clone.querySelector('p').innerHTML = products[j].description;
          } else {
            item_clone.querySelector('a').classList.add('disabled');
            item_clone.querySelector('data').value = false;
            item_clone.querySelector('p').innerHTML = 'Out of Stock';
          }
          clone.querySelector('.items').append(item_clone);
        } else {

        }
      }
      $('.menu').append(clone);
    }
  });

  updateCart();
}

$('form').addEventListener('submit', function(e) {
  e.preventDefault(); // prevents page reloading
  if (cart.items.length > 0) {
    post('/order', {
      cart: JSON.stringify(cart.items),
      price: cart.price,
      ready: false
    });
  }
  console.log('order sent');
  return false;
}, false);

function toggleCategory(element) {
  return false;
}

function selectItem(element) {
  let item_id = element.querySelector('data').value;
  let item = products[item_id];
  if (item_id != 'false' && !(element.classList.contains('disabled'))) {
    try {
      $('.details').removeChild($(".item_details"));
    } catch (e) {
      console.error("unable to remove last item details");
      console.error(e);
    }
    let clone = $('#item_details').content.cloneNode(true);
    clone.querySelector('data').value = item_id;
    clone.querySelector('h2').innerHTML = products[item_id].name;
    clone.querySelector('.description').innerHTML = products[item_id].description;
    clone.querySelector('img').src = '/assets/' + products[item_id].image;
    clone.querySelector('.price').innerHTML = '£' + (Math.round(products[item_id].price * 100) / 100).toFixed(2);
    console.log(clone);
    // Ingredients checkbox generator
    if (products[item_id].ingredients.length > 0) {
      for (var i = 0; i < products[item_id].ingredients.length; i++) {
        let finishedHTML;
        finishedHTML = '<input type="checkbox" name="ingredients" value="' + products[item_id].ingredients[i] + '"id="' + products[item_id].ingredients[i] + '"' + ' checked>';
        clone.querySelector('.ingredients').append(createElementFromHTML(finishedHTML));
        finishedHTML = '<label for="' + products[item_id].ingredients[i] + '">' + products[item_id].ingredients[i] + '</label>'
        clone.querySelector('.ingredients').append(createElementFromHTML(finishedHTML));
      }
    } else {
      let parent_node = clone.querySelector('.ingredients').parentElement;
      let node = clone.querySelector('.ingredients');
      parent_node.removeChild(node);
    }
    // Sauce checkbox generation
    if (products[item_id].sauces.length > 0) {
      for (var i = 0; i < products[item_id].sauces.length; i++) {
        let finishedHTML;
        finishedHTML = '<input type="checkbox" name="sauces" value="' + products[item_id].sauces[i] + '"id="' + products[item_id].sauces[i] + '"' + '>';
        clone.querySelector('.sauces').append(createElementFromHTML(finishedHTML));
        finishedHTML = '<label for="' + products[item_id].sauces[i] + '">' + products[item_id].sauces[i] + '</label>';
        clone.querySelector('.sauces').append(createElementFromHTML(finishedHTML));
      }
    } else {
      let parent_node = clone.querySelector('.sauces').parentElement;
      let node = clone.querySelector('.sauces');
      parent_node.removeChild(node);
    }
    // Options checkbox generation
    if (products[item_id].options.length > 0) {
      for (var i = 0; i < products[item_id].options.length; i++) {
        let finishedHTML;
        if (products[item_id].options[i].default) {
          finishedHTML = '<input type="checkbox" name="options" value="' + products[item_id].options[i].name + '"id="' + products[item_id].options[i].name + '"' + ' checked>';
        } else {
          finishedHTML = '<input type="checkbox" name="options" value="' + products[item_id].options[i].name + '"id="' + products[item_id].options[i].name + '"' + '>';
        }
        clone.querySelector('.options').append(createElementFromHTML(finishedHTML));
        finishedHTML = '<label for="' + products[item_id].options[i].name + '">' + products[item_id].options[i].name + " +£" + (Math.round(products[item_id].options[i].price * 100) / 100).toFixed(2) + '</label>';
        clone.querySelector('.options').append(createElementFromHTML(finishedHTML));
      }
    } else {
      let parent_node = clone.querySelector('.options').parentElement;
      let node = clone.querySelector('.options');
      parent_node.removeChild(node);
    }
    // Append to the finished item details to the details div on page
    $('.details').append(clone);
  }
  return false;
}

function addToCart(element) {
  let form = element.parentElement;
  let product_id = form.querySelector('data').value;
  let item = {};
  item.name = products[product_id].name;
  item.price = products[product_id].price;
  item.ingredients = [];
  item.special = "Nothing special";
  let form_special = form.querySelectorAll('input[name="special"]')[0]
  try {
    console.log(form_special);
    console.log(form_special.value);
    if (form_special.value != undefined) {
      item.special = form_special.value;
    }
  } catch (e) {
    console.log("No special requests were found");
  }
  let form_ingredients = form.querySelectorAll('input[name="ingredients"]')
  try {
    for (var i = 0; i < form_ingredients.length; i++) {
      if (form_ingredients[i].checked) {
        item.ingredients.push(form_ingredients[i].value);
      }
    }
  } catch (e) {
    console.log("No ingredients were found or checked");
  }
  item.sauces = [];
  let form_sauces = form.querySelectorAll('input[name="sauces"]')
  try {
    for (var i = 0; i < form_sauces.length; i++) {
      if (form_sauces[i].checked) {
        item.sauces.push(form_sauces[i].value);
      }
    }
  } catch (e) {
    console.log("No sauces were found or checked");
  }
  item.options = [];
  let form_options = form.querySelectorAll('input[name="options"]')
  try {
    for (var i = 0; i < form_options.length; i++) {
      if (form_options[i].checked) {
        item.options.push(form_options[i].value);
        for (var j = 0; j < products[product_id].options.length; j++) {
          if (form_options[i].value == products[product_id].options[j].name) {
            item.price += products[product_id].options[j].price;
          }
        }
      }
    }
  } catch (e) {
    console.log("No options were found or checked");
  }
  cart.items.push(item);
  updateCart();
  return false;
}

function updateCart() {
  let cart_node = $('.form .cart');
  let total_price = 0;
  if (cart.items.length > 0) {
    cart_node.querySelector('.items').innerHTML = '';
    for (var i = 0; i < cart.items.length; i++) {
      total_price += cart.items[i].price;
      cart_node.querySelector('.items').append(createElementFromHTML('<div><p class="name">' + cart.items[i].name + '</p><p class="price">' + cart.items[i].price + '</p><a class="remove_item">-</a></div>'))
    }
  } else {
    cart_node.querySelector('.items').innerHTML = 'You have no items in cart';
    cart_node.querySelector('input[value="Order"]');
  }
  cart_node.querySelector('.cart_info .price').innerHTML = '£' + (Math.round(total_price * 100) / 100).toFixed(2);
  cart_node.querySelector('.cart_info .quantity').innerHTML = cart.items.length + " items";
  cart.price = total_price;
  console.log(cart);
  return false;
}

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
}

function post(path, params, method = 'post') {

  // The rest of this code assumes you are not using a library.
  // It can be made less wordy if you use one.
  const form = document.createElement('form');
  form.method = method;
  form.action = path;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = key;
      hiddenField.value = params[key];

      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
}

init();