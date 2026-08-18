(function () {
  var slug = document.body.getAttribute('data-product');
  var product = window.TWILIGHT_PRODUCTS && window.TWILIGHT_PRODUCTS[slug];
  if (!product) { window.location.href = '../../products.html'; return; }

  var root = '../../assets/images/';
  var selections = {};
  var lineItems = {};
  product.variants.forEach(function (variant) { selections[variant.name] = variant.options[0]; });

  function money(value) {
    return '৳' + value.toLocaleString('en-US');
  }

  function copySelections(source) {
    var copy = {};
    product.variants.forEach(function (variant) { copy[variant.name] = source[variant.name]; });
    return copy;
  }

  function selectionKey(source) {
    if (!product.variants.length) return 'Standard';
    return product.variants.map(function (variant) {
      return variant.name + '=' + source[variant.name];
    }).join('|');
  }

  function selectionLabel(source) {
    if (!product.variants.length) return 'Standard';
    return product.variants.map(function (variant) {
      return variant.name + ': ' + source[variant.name];
    }).join(' · ');
  }

  function activeKeys() {
    return Object.keys(lineItems).filter(function (key) {
      return lineItems[key].quantity > 0;
    });
  }

  function calculateTotals() {
    var totalQuantity = activeKeys().reduce(function (sum, key) {
      return sum + lineItems[key].quantity;
    }, 0);
    var productTotal = product.price * totalQuantity;
    var totalWeight = product.weightGrams * totalQuantity;
    var chargedKg = totalQuantity ? Math.max(1, Math.ceil(totalWeight / 1000)) : 0;
    var area = document.querySelector('[name="shipping-area"]:checked');
    var insideDhaka = !area || area.value === 'inside';
    var shippingCost = totalQuantity ? (insideDhaka ? 80 : 110) + Math.max(0, chargedKg - 1) * 25 : 0;
    return {
      totalQuantity: totalQuantity,
      productTotal: productTotal,
      totalWeight: totalWeight,
      chargedKg: chargedKg,
      insideDhaka: insideDhaka,
      shippingCost: shippingCost,
      payable: productTotal + shippingCost
    };
  }


  document.title = product.name + ' | Twilight Market';
  document.querySelector('[data-product-name]').textContent = product.name;
  document.querySelector('[data-product-short]').textContent = product.shortName;
  document.querySelector('[data-badge]').textContent = product.badge;
  document.querySelector('[data-summary]').textContent = product.summary;
  document.querySelector('[data-delivery]').textContent = product.delivery;
  document.querySelector('[data-description]').textContent = product.description;
  document.querySelector('[data-price]').textContent = money(product.price);
  document.querySelector('[data-gallery-price]').textContent = money(product.price);
  if (product.originalPrice) {
    document.querySelector('[data-original-price]').textContent = money(product.originalPrice);
  } else {
    document.querySelector('[data-original-price]').remove();
  }

  var mainImage = document.querySelector('[data-main-image]');
  mainImage.src = root + product.images[0];
  mainImage.alt = product.name;
  var thumbs = document.querySelector('[data-thumbs]');
  product.images.forEach(function (file, index) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = index === 0 ? 'active' : '';
    button.setAttribute('aria-label', 'Show product image ' + (index + 1));
    var image = document.createElement('img');
    image.src = root + file;
    image.alt = '';
    button.appendChild(image);
    button.addEventListener('click', function () {
      mainImage.src = root + file;
      thumbs.querySelectorAll('button').forEach(function (item) { item.classList.remove('active'); });
      button.classList.add('active');
    });
    thumbs.appendChild(button);
  });
  if (product.images.length < 2) thumbs.hidden = true;

  var variants = document.querySelector('[data-variants]');
  var variantControls = {};
  product.variants.forEach(function (variant) {
    var field = document.createElement('fieldset');
    var legend = document.createElement('legend');
    var label = document.createElement('span');
    label.textContent = variant.name + ': ';
    var chosen = document.createElement('strong');
    chosen.textContent = selections[variant.name];
    legend.appendChild(label);
    legend.appendChild(chosen);
    var row = document.createElement('div');
    row.className = 'option-row';
    variant.options.forEach(function (option, index) {
      var button = document.createElement('button');
      button.type = 'button';
      button.textContent = option;
      button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
      if (index === 0) button.className = 'selected';
      button.addEventListener('click', function () {
        selections[variant.name] = option;
        chosen.textContent = option;
        row.querySelectorAll('button').forEach(function (item) {
          item.classList.remove('selected');
          item.setAttribute('aria-pressed', 'false');
        });
        button.classList.add('selected');
        button.setAttribute('aria-pressed', 'true');
        updateCurrentSelection();
      });
      row.appendChild(button);
    });
    variantControls[variant.name] = { field: field, chosen: chosen, row: row };
    field.appendChild(legend);
    field.appendChild(row);
    variants.appendChild(field);
  });

  var initialKey = selectionKey(selections);
  lineItems[initialKey] = { choices: copySelections(selections), quantity: 1 };

  var qty = document.querySelector('[data-quantity]');
  var currentChoice = document.querySelector('[data-current-choice]');
  var selectedItems = document.querySelector('[data-selected-items]');
  var productTotalNode = document.querySelector('[data-total]');
  var shippingNode = document.querySelector('[data-shipping-cost]');
  var payableNode = document.querySelector('[data-payable]');

  function updateCurrentSelection() {
    var key = selectionKey(selections);
    qty.textContent = lineItems[key] ? lineItems[key].quantity : 0;
    currentChoice.textContent = selectionLabel(selections);
  }

  function renderSummary() {
    var keys = activeKeys();
    selectedItems.innerHTML = '';
    if (!keys.length) {
      var empty = document.createElement('p');
      empty.className = 'empty-selection';
      empty.textContent = 'Choose an option above and use + to add it to your order.';
      selectedItems.appendChild(empty);
    }

    keys.forEach(function (key) {
      var item = lineItems[key];
      var row = document.createElement('div');
      row.className = 'selection-item';
      var details = document.createElement('div');
      var title = document.createElement('strong');
      title.textContent = selectionLabel(item.choices);
      var price = document.createElement('small');
      price.textContent = item.quantity + ' × ' + money(product.price) + ' = ' + money(item.quantity * product.price);
      details.appendChild(title);
      details.appendChild(price);
      var remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', 'Remove ' + selectionLabel(item.choices));
      remove.addEventListener('click', function () {
        delete lineItems[key];
        updateCurrentSelection();
        renderSummary();
      });
      row.appendChild(details);
      row.appendChild(remove);
      selectedItems.appendChild(row);
    });

    var totals = calculateTotals();
    productTotalNode.textContent = 'Product subtotal: ' + money(totals.productTotal);
    shippingNode.textContent = 'Shipping cost: ' + money(totals.shippingCost);
    payableNode.textContent = 'Total payable: ' + money(totals.payable);
  }

  function changeCurrentQuantity(amount) {
    var key = selectionKey(selections);
    var current = lineItems[key] ? lineItems[key].quantity : 0;
    var next = Math.max(0, Math.min(10, current + amount));
    if (!next) {
      delete lineItems[key];
    } else {
      lineItems[key] = { choices: copySelections(selections), quantity: next };
    }
    updateCurrentSelection();
    renderSummary();
  }

  document.querySelector('[data-minus]').addEventListener('click', function () { changeCurrentQuantity(-1); });
  document.querySelector('[data-plus]').addEventListener('click', function () { changeCurrentQuantity(1); });
  document.querySelectorAll('[name="shipping-area"]').forEach(function (input) {
    input.addEventListener('change', renderSummary);
  });
  updateCurrentSelection();
  renderSummary();


  var addCartButton = document.querySelector('[data-add-cart]');
  var cartStatus = document.querySelector('[data-cart-status]');
  if (addCartButton) {
    addCartButton.addEventListener('click', function () {
      var keys = activeKeys();
      if (!keys.length) {
        cartStatus.textContent = 'Choose at least one option and quantity first.';
        cartStatus.className = 'cart-status error';
        return;
      }
      if (!window.TWILIGHT_CART) {
        cartStatus.textContent = 'The cart could not be opened. Please refresh and try again.';
        cartStatus.className = 'cart-status error';
        return;
      }
      var cartItems = keys.map(function (key) {
        var item = lineItems[key];
        return {
          id: slug + '::' + key,
          slug: slug,
          name: product.name,
          image: product.images[0],
          choices: copySelections(item.choices),
          price: product.price,
          weightGrams: product.weightGrams,
          quantity: item.quantity,
          selected: true
        };
      });
      window.TWILIGHT_CART.addItems(cartItems);
      var addedQuantity = cartItems.reduce(function (sum, item) { return sum + item.quantity; }, 0);
      cartStatus.textContent = addedQuantity + (addedQuantity === 1 ? ' item added to your cart.' : ' items added to your cart.');
      cartStatus.className = 'cart-status success';
    });
  }

  document.querySelector('[data-features]').innerHTML = product.features.map(function (item) {
    return '<p><span>✓</span>' + item + '</p>';
  }).join('');
  document.querySelector('[data-specs]').innerHTML = product.specs.map(function (item) {
    return '<div><dt>' + item[0] + '</dt><dd>' + item[1] + '</dd></div>';
  }).join('');

  var accounts = [
    { number: '8801729624403', display: '+880 1729-624403' },
    { number: '8801410395694', display: '+880 1410-395694' }
  ];
  document.querySelectorAll('[data-whatsapp]').forEach(function (button, index) {
    button.querySelector('strong').textContent = accounts[index].display;
    button.addEventListener('click', function () {
      var name = document.querySelector('[name="customer-name"]').value.trim();
      var phone = document.querySelector('[name="customer-phone"]').value.trim();
      var address = document.querySelector('[name="customer-address"]').value.trim();
      var error = document.querySelector('[data-error]');
      var keys = activeKeys();
      if (!keys.length) {
        error.textContent = 'Add at least one product option and quantity first.';
        return;
      }
      if (!name || !phone || !address) {
        error.textContent = 'Enter your name, phone number and delivery address first.';
        return;
      }
      error.textContent = '';
      var totals = calculateTotals();
      var itemLines = keys.map(function (key, itemIndex) {
        var item = lineItems[key];
        return (itemIndex + 1) + '. ' + selectionLabel(item.choices) + ' — ' + item.quantity + ' × ' + money(product.price) + ' = ' + money(item.quantity * product.price);
      });
      var areaLabel = totals.insideDhaka ? 'Inside Dhaka city' : 'Outside Dhaka city';
      var message = [
        'Hello Twilight Market, I want to place an order.',
        '',
        'Product: ' + product.name,
        'Selected items:',
        itemLines.join('\n'),
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
}());
