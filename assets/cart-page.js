(function () {
  var cartApi = window.TWILIGHT_CART;
  var products = window.TWILIGHT_PRODUCTS || {};
  if (!cartApi) return;

  var itemRoot = document.querySelector('[data-cart-items]');
  var clearButton = document.querySelector('[data-clear-cart]');
  var selectedCount = document.querySelector('[data-selected-count]');
  var productTotalNode = document.querySelector('[data-cart-subtotal]');
  var shippingNode = document.querySelector('[data-cart-shipping]');
  var payableNode = document.querySelector('[data-cart-payable]');
  var orderError = document.querySelector('[data-cart-error]');
  var orderButtons = document.querySelectorAll('[data-cart-whatsapp]');
  var accounts = [
    { number: '8801729624403', display: '+880 1729-624403' },
    { number: '8801410395694', display: '+880 1410-395694' }
  ];

  function money(value) {
    return '৳' + value.toLocaleString('en-US');
  }

  function optionText(choices) {
    var labels = Object.keys(choices || {}).map(function (name) {
      return name + ': ' + choices[name];
    });
    return labels.length ? labels.join(' · ') : 'Standard';
  }

  function currentArea() {
    var selected = document.querySelector('[name="cart-shipping-area"]:checked');
    return selected ? selected.value : 'inside';
  }

  function saveArea(area) {
    try { window.localStorage.setItem('twilight-market-shipping-area', area); } catch (error) {}
  }

  function loadArea() {
    var saved = 'inside';
    try { saved = window.localStorage.getItem('twilight-market-shipping-area') || 'inside'; } catch (error) {}
    var input = document.querySelector('[name="cart-shipping-area"][value="' + saved + '"]');
    if (input) input.checked = true;
  }

  function renderTotals(items) {
    var totals = cartApi.calculate(items, currentArea());
    selectedCount.textContent = totals.quantity + (totals.quantity === 1 ? ' selected item' : ' selected items');
    productTotalNode.textContent = 'Product subtotal: ' + money(totals.productTotal);
    shippingNode.textContent = 'Shipping cost: ' + money(totals.shippingCost);
    payableNode.textContent = 'Total payable: ' + money(totals.payable);
    orderButtons.forEach(function (button) { button.disabled = totals.quantity === 0; });
    return totals;
  }

  function render() {
    var items = cartApi.syncProducts(products);
    itemRoot.innerHTML = '';

    if (!items.length) {
      var empty = document.createElement('div');
      empty.className = 'empty-cart';
      var title = document.createElement('h2');
      title.textContent = 'Your cart is empty';
      var copy = document.createElement('p');
      copy.textContent = 'Choose a product, select its options and add it to your cart.';
      var link = document.createElement('a');
      link.href = 'products.html';
      link.className = 'primary-link';
      link.textContent = 'Shop products →';
      empty.appendChild(title);
      empty.appendChild(copy);
      empty.appendChild(link);
      itemRoot.appendChild(empty);
      clearButton.hidden = true;
      renderTotals(items);
      return;
    }

    clearButton.hidden = false;
    items.forEach(function (item) {
      var row = document.createElement('article');
      row.className = 'cart-item' + (item.selected === false ? ' is-unselected' : '');

      var selector = document.createElement('label');
      selector.className = 'cart-select';
      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = item.selected !== false;
      checkbox.setAttribute('aria-label', 'Select ' + item.name);
      checkbox.addEventListener('change', function () {
        cartApi.updateItem(item.id, { selected: checkbox.checked });
        render();
      });
      selector.appendChild(checkbox);
      var selectorText = document.createElement('span');
      selectorText.textContent = 'Select';
      selector.appendChild(selectorText);

      var imageLink = document.createElement('a');
      imageLink.className = 'cart-item-image';
      imageLink.href = 'products/' + item.slug + '/';
      var image = document.createElement('img');
      image.src = 'assets/images/' + item.image;
      image.alt = item.name;
      imageLink.appendChild(image);

      var details = document.createElement('div');
      details.className = 'cart-item-details';
      var name = document.createElement('h2');
      var productLink = document.createElement('a');
      productLink.href = 'products/' + item.slug + '/';
      productLink.textContent = item.name;
      name.appendChild(productLink);
      var choices = document.createElement('p');
      choices.textContent = optionText(item.choices);
      var unit = document.createElement('strong');
      unit.textContent = money(item.price) + ' each';
      details.appendChild(name);
      details.appendChild(choices);
      details.appendChild(unit);

      var controls = document.createElement('div');
      controls.className = 'cart-item-controls';
      var quantity = document.createElement('div');
      quantity.className = 'quantity-control';
      var minus = document.createElement('button');
      minus.type = 'button';
      minus.textContent = '−';
      minus.setAttribute('aria-label', 'Decrease ' + item.name);
      minus.addEventListener('click', function () {
        cartApi.updateItem(item.id, { quantity: Math.max(1, item.quantity - 1) });
        render();
      });
      var amount = document.createElement('strong');
      amount.textContent = item.quantity;
      var plus = document.createElement('button');
      plus.type = 'button';
      plus.textContent = '+';
      plus.setAttribute('aria-label', 'Increase ' + item.name);
      plus.addEventListener('click', function () {
        cartApi.updateItem(item.id, { quantity: Math.min(99, item.quantity + 1) });
        render();
      });
      quantity.appendChild(minus);
      quantity.appendChild(amount);
      quantity.appendChild(plus);
      var subtotal = document.createElement('strong');
      subtotal.className = 'cart-line-total';
      subtotal.textContent = money(item.price * item.quantity);
      var remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'cart-remove';
      remove.textContent = 'Remove';
      remove.addEventListener('click', function () {
        cartApi.removeItem(item.id);
        render();
      });
      controls.appendChild(quantity);
      controls.appendChild(subtotal);
      controls.appendChild(remove);

      row.appendChild(selector);
      row.appendChild(imageLink);
      row.appendChild(details);
      row.appendChild(controls);
      itemRoot.appendChild(row);
    });

    renderTotals(items);
  }

  document.querySelectorAll('[name="cart-shipping-area"]').forEach(function (input) {
    input.addEventListener('change', function () {
      saveArea(input.value);
      renderTotals(cartApi.read());
    });
  });

  clearButton.addEventListener('click', function () {
    cartApi.clear();
    render();
  });

  orderButtons.forEach(function (button, index) {
    button.querySelector('strong').textContent = accounts[index].display;
    button.addEventListener('click', function () {
      var items = cartApi.syncProducts(products);
      var totals = cartApi.calculate(items, currentArea());
      var name = document.querySelector('[name="cart-customer-name"]').value.trim();
      var phone = document.querySelector('[name="cart-customer-phone"]').value.trim();
      var address = document.querySelector('[name="cart-customer-address"]').value.trim();
      if (!totals.quantity) {
        orderError.textContent = 'Select at least one cart item first.';
        return;
      }
      if (!name || !phone || !address) {
        orderError.textContent = 'Enter your name, phone number and delivery address first.';
        return;
      }
      orderError.textContent = '';
      var itemLines = totals.selectedItems.map(function (item, itemIndex) {
        return (itemIndex + 1) + '. ' + item.name + ' — ' + optionText(item.choices) + ' — ' + item.quantity + ' × ' + money(item.price) + ' = ' + money(item.quantity * item.price);
      });
      var areaLabel = currentArea() === 'outside' ? 'Outside Dhaka city' : 'Inside Dhaka city';
      var message = [
        'Hello Twilight Market, I want to order the selected items from my cart.',
        '',
        'Selected items:',
        itemLines.join('\n'),
        '',
        'Product subtotal: ' + money(totals.productTotal),
        'Shipping area: ' + areaLabel,
        'Shipping cost: ' + money(totals.shippingCost),
        'Total payable: ' + money(totals.payable),
        '',
        'Customer name: ' + name,
        'Phone: ' + phone,
        'Delivery address: ' + address,
        '',
        'Please confirm availability and the order.'
      ].join('\n');
      window.open('https://wa.me/' + accounts[index].number + '?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
    });
  });

  loadArea();
  render();
}());
