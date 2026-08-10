(function () {
  var slug = document.body.getAttribute('data-product');
  var product = window.TWILIGHT_PRODUCTS && window.TWILIGHT_PRODUCTS[slug];
  if (!product) { window.location.href = '../../'; return; }

  var root = '../../assets/images/';
  var selections = {};
  var quantity = 1;
  product.variants.forEach(function (variant) { selections[variant.name] = variant.options[0]; });
  document.title = product.name + ' | Twilight Market';
  document.querySelector('[data-product-name]').textContent = product.name;
  document.querySelector('[data-product-short]').textContent = product.shortName;
  document.querySelector('[data-category]').textContent = product.category;
  document.querySelector('[data-badge]').textContent = product.badge;
  document.querySelector('[data-summary]').textContent = product.summary;
  document.querySelector('[data-delivery]').textContent = product.delivery;
  document.querySelector('[data-description]').textContent = product.description;
  document.querySelector('[data-price]').textContent = '৳' + product.price.toLocaleString('en-US');
  if (product.originalPrice) {
    document.querySelector('[data-original-price]').textContent = '৳' + product.originalPrice.toLocaleString('en-US');
  } else {
    document.querySelector('[data-original-price]').remove();
  }

  var mainImage = document.querySelector('[data-main-image]');
  mainImage.src = root + product.images[0]; mainImage.alt = product.name;
  var thumbs = document.querySelector('[data-thumbs]');
  product.images.forEach(function (file, index) {
    var button = document.createElement('button');
    button.type = 'button'; button.className = index === 0 ? 'active' : '';
    button.setAttribute('aria-label', 'Show product image ' + (index + 1));
    button.innerHTML = '<img src="' + root + file + '" alt="">';
    button.addEventListener('click', function () {
      mainImage.src = root + file;
      thumbs.querySelectorAll('button').forEach(function (item) { item.classList.remove('active'); });
      button.classList.add('active');
    });
    thumbs.appendChild(button);
  });
  if (product.images.length < 2) thumbs.hidden = true;

  var variants = document.querySelector('[data-variants]');
  product.variants.forEach(function (variant) {
    var field = document.createElement('fieldset');
    var legend = document.createElement('legend');
    legend.innerHTML = variant.name + ': <strong>' + selections[variant.name] + '</strong>';
    var row = document.createElement('div'); row.className = 'option-row';
    variant.options.forEach(function (option, index) {
      var button = document.createElement('button'); button.type = 'button'; button.textContent = option;
      if (index === 0) button.className = 'selected';
      button.addEventListener('click', function () {
        selections[variant.name] = option; legend.querySelector('strong').textContent = option;
        row.querySelectorAll('button').forEach(function (item) { item.classList.remove('selected'); });
        button.classList.add('selected');
      });
      row.appendChild(button);
    });
    field.appendChild(legend); field.appendChild(row); variants.appendChild(field);
  });

  var qty = document.querySelector('[data-quantity]');
  var total = document.querySelector('[data-total]');
  function updateTotal() { qty.textContent = quantity; total.textContent = 'Total: ৳' + (product.price * quantity).toLocaleString('en-US'); }
  document.querySelector('[data-minus]').addEventListener('click', function () { quantity = Math.max(1, quantity - 1); updateTotal(); });
  document.querySelector('[data-plus]').addEventListener('click', function () { quantity = Math.min(10, quantity + 1); updateTotal(); });
  updateTotal();

  document.querySelector('[data-features]').innerHTML = product.features.map(function (item) { return '<p><span>✓</span>' + item + '</p>'; }).join('');
  var accounts = [{number:'8801729624403',display:'+880 1729-624403'},{number:'8801410395694',display:'+880 1410-395694'}];
  document.querySelectorAll('[data-whatsapp]').forEach(function (button, index) {
    button.querySelector('strong').textContent = accounts[index].display;
    button.addEventListener('click', function () {
      var name = document.querySelector('[name="customer-name"]').value.trim();
      var phone = document.querySelector('[name="customer-phone"]').value.trim();
      var address = document.querySelector('[name="customer-address"]').value.trim();
      var error = document.querySelector('[data-error]');
      if (!name || !phone || !address) { error.textContent = 'Enter your name, phone number and delivery address first.'; return; }
      error.textContent = '';
      var choices = product.variants.map(function (variant) { return variant.name + ': ' + selections[variant.name]; }).join('\n');
      var message = ['Hello Twilight Market, I want to place an order.','', 'Product: ' + product.name, choices, 'Quantity: ' + quantity, 'Unit price: ৳' + product.price.toLocaleString('en-US'), 'Product total: ৳' + (product.price * quantity).toLocaleString('en-US'), 'Delivery: ' + product.delivery, '', 'Customer name: ' + name, 'Phone: ' + phone, 'Delivery address: ' + address, '', 'Please confirm availability and final payable amount.'].join('\n');
      window.open('https://wa.me/' + accounts[index].number + '?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
    });
  });
}());
