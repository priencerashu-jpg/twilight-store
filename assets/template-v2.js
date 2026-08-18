(function () {
  var shell = document.getElementById('product-shell');
  if (!shell) return;

  shell.outerHTML = [
    '<header class="site-header">',
      '<a class="brand" href="../../home.html"><img src="../../assets/images/twilight-logo.png" alt="Twilight Market"><small>Quality is our first priority</small></a>',
      '<button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false">☰</button>',
      '<nav class="site-nav" aria-label="Main navigation"><a href="../../home.html">Home</a><a class="active" href="../../products.html">Products</a><a href="../../about.html">About Us</a><a href="../../contact.html">Contact</a><a class="cart-link" href="../../cart.html">Cart <span data-cart-count>0</span></a></nav>',
      '<a class="order-now" href="../../products.html">Shop Products</a>',
    '</header>',
    '<main class="product-page">',
      '<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="../../products.html">Products</a><span>/</span><strong data-product-short></strong></nav>',
      '<section class="product-top">',
        '<div class="product-gallery"><div class="gallery-main"><img data-main-image src="" alt=""><span class="gallery-price" data-gallery-price></span><span class="gallery-delivery">FULL PRODUCT VIEW</span></div><div class="gallery-thumbs" data-thumbs></div></div>',
        '<div class="order-panel"><span class="product-badge" data-badge></span><h1 data-product-name></h1><div class="detail-price"><del data-original-price></del><strong data-price></strong><small>per order</small></div><p class="summary" data-summary></p><p class="delivery-note">🚚 <span data-delivery></span></p><div class="variant-stack" data-variants></div><div class="quantity-line"><div class="quantity-label"><span>Quantity for this selection</span><small data-current-choice></small></div><div class="quantity-control"><button type="button" data-minus aria-label="Decrease quantity">−</button><strong data-quantity>1</strong><button type="button" data-plus aria-label="Increase quantity">+</button></div></div><section class="order-summary" aria-live="polite"><h2>Selected items</h2><div data-selected-items></div><div class="cost-lines"><strong data-total></strong><strong data-shipping-cost></strong><strong data-payable></strong></div></section><fieldset class="shipping-area"><legend>Delivery area</legend><label><input type="radio" name="shipping-area" value="inside" checked> Inside Dhaka city</label><label><input type="radio" name="shipping-area" value="outside"> Outside Dhaka city</label></fieldset><div class="cart-actions"><button type="button" data-add-cart>Add selected items to cart</button><a href="../../cart.html">View cart <span data-cart-count>0</span> →</a></div><p class="cart-status" data-cart-status aria-live="polite"></p><div class="customer-fields"><label>Your Name<input name="customer-name" autocomplete="name" placeholder="Full name"></label><label>Phone Number<input name="customer-phone" autocomplete="tel" inputmode="tel" placeholder="01XXXXXXXXX"></label><label>Delivery Address<textarea name="customer-address" autocomplete="street-address" rows="2" placeholder="House, road, area, district"></textarea></label></div><p class="form-error" data-error aria-live="polite"></p><div class="whatsapp-buttons"><button type="button" data-whatsapp><span>◉ Order on WhatsApp 1</span><strong></strong></button><button type="button" data-whatsapp><span>◉ Order on WhatsApp 2</span><strong></strong></button></div><small class="send-help">Choose either sales account. WhatsApp opens with every selected color, its quantity, item prices, shipping cost and delivery details ready to send.</small></div>',
      '</section>',
      '<section class="description-panel"><div class="details-copy"><span>PRODUCT INFORMATION</span><h2>Product Details</h2><p data-description></p><div class="feature-list" data-features></div></div><div class="specification-card"><span>SPECIFICATIONS</span><h2>At a glance</h2><dl data-specs></dl></div></section>',
      '<section class="order-steps" aria-label="How to order"><div><b>1</b><span><strong>Choose options</strong><small>Select colors and quantities.</small></span></div><div><b>2</b><span><strong>Add to cart</strong><small>Your cart stays on this device without an account.</small></span></div><div><b>3</b><span><strong>Review and order</strong><small>Select cart items, check the total and send on WhatsApp.</small></span></div></section>',
    '</main>',
    '<footer class="main-footer"><div class="footer-brand"><img src="../../assets/images/twilight-logo.png" alt="Twilight Market"><p>Quality is our first priority.</p></div><div><strong>Explore</strong><a href="../../home.html">Home</a><a href="../../products.html">Products</a><a href="../../about.html">About Us</a><a href="../../contact.html">Contact</a><a href="../../cart.html">Cart</a></div><div><strong>WhatsApp Orders</strong><a href="https://wa.me/8801729624403">+880 1729-624403</a><a href="https://wa.me/8801410395694">+880 1410-395694</a><span>Mirpur-1, Dhaka</span></div><small>© <span data-year>2026</span> Twilight Market. All rights reserved.</small><span class="product-visit-counter" data-product-visitor aria-live="polite"></span></footer>'
  ].join('');

  var data = document.createElement('script');
  data.src = '../../assets/data.js?v=20260818-5';
  data.onload = function () {
    var cart = document.createElement('script');
    cart.src = '../../assets/cart.js?v=20260818-5';
    cart.onload = function () {
      var product = document.createElement('script');
      product.src = '../../assets/product-v2.js?v=20260818-5';
      document.body.appendChild(product);
    };
    document.body.appendChild(cart);
  };
  document.body.appendChild(data);

  var site = document.createElement('script');
  site.src = '../../assets/site.js?v=20260818-5';
  document.body.appendChild(site);
}());
