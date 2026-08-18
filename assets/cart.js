(function (window, document) {
  var STORAGE_KEY = 'twilight-market-cart-v1';
  var fallbackItems = [];

  function cleanQuantity(value) {
    var quantity = parseInt(value, 10);
    return Number.isFinite(quantity) ? Math.max(1, Math.min(99, quantity)) : 1;
  }

  function cleanItem(item) {
    if (!item || !item.id || !item.slug) return null;
    return {
      id: String(item.id),
      slug: String(item.slug),
      name: String(item.name || ''),
      image: String(item.image || ''),
      choices: item.choices && typeof item.choices === 'object' ? item.choices : {},
      price: Math.max(0, Number(item.price) || 0),
      weightGrams: Math.max(0, Number(item.weightGrams) || 0),
      quantity: cleanQuantity(item.quantity),
      selected: item.selected !== false
    };
  }

  function read() {
    try {
      var saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
      if (!Array.isArray(saved)) return [];
      return saved.map(cleanItem).filter(Boolean);
    } catch (error) {
      return fallbackItems.slice();
    }
  }

  function notify(items) {
    updateBadges(items);
    try {
      window.dispatchEvent(new CustomEvent('twilight-cart-changed', { detail: { items: items } }));
    } catch (error) {
      var event = document.createEvent('Event');
      event.initEvent('twilight-cart-changed', true, true);
      window.dispatchEvent(event);
    }
  }

  function write(items) {
    var clean = (Array.isArray(items) ? items : []).map(cleanItem).filter(Boolean);
    fallbackItems = clean.slice();
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    } catch (error) {
      // The in-memory fallback keeps the cart usable when storage is blocked.
    }
    notify(clean);
    return clean;
  }

  function count(items) {
    return (items || read()).reduce(function (sum, item) { return sum + cleanQuantity(item.quantity); }, 0);
  }

  function updateBadges(items) {
    var total = count(items || read());
    document.querySelectorAll('[data-cart-count]').forEach(function (node) {
      node.textContent = total;
      node.setAttribute('aria-label', total + (total === 1 ? ' item in cart' : ' items in cart'));
      node.classList.toggle('has-items', total > 0);
    });
  }

  function addItems(newItems) {
    var items = read();
    (newItems || []).map(cleanItem).filter(Boolean).forEach(function (incoming) {
      var existing = items.find(function (item) { return item.id === incoming.id; });
      if (existing) {
        existing.quantity = Math.min(99, existing.quantity + incoming.quantity);
        existing.selected = true;
        existing.price = incoming.price;
        existing.weightGrams = incoming.weightGrams;
        existing.name = incoming.name;
        existing.image = incoming.image;
        existing.choices = incoming.choices;
      } else {
        items.push(incoming);
      }
    });
    return write(items);
  }

  function updateItem(id, changes) {
    var items = read();
    var item = items.find(function (entry) { return entry.id === id; });
    if (!item) return items;
    if (Object.prototype.hasOwnProperty.call(changes, 'quantity')) item.quantity = cleanQuantity(changes.quantity);
    if (Object.prototype.hasOwnProperty.call(changes, 'selected')) item.selected = changes.selected !== false;
    return write(items);
  }

  function removeItem(id) {
    return write(read().filter(function (item) { return item.id !== id; }));
  }

  function clear() {
    return write([]);
  }

  function syncProducts(products) {
    var items = read();
    var changed = false;
    items.forEach(function (item) {
      var product = products && products[item.slug];
      if (!product) return;
      var nextImage = product.images && product.images[0] ? product.images[0] : item.image;
      if (item.name !== product.name || item.price !== product.price || item.weightGrams !== product.weightGrams || item.image !== nextImage) {
        item.name = product.name;
        item.price = product.price;
        item.weightGrams = product.weightGrams;
        item.image = nextImage;
        changed = true;
      }
    });
    return changed ? write(items) : items;
  }

  function calculate(items, area) {
    var selected = (items || []).filter(function (item) { return item.selected !== false; });
    var quantity = selected.reduce(function (sum, item) { return sum + cleanQuantity(item.quantity); }, 0);
    var productTotal = selected.reduce(function (sum, item) {
      return sum + (Number(item.price) || 0) * cleanQuantity(item.quantity);
    }, 0);
    var totalWeight = selected.reduce(function (sum, item) {
      return sum + (Number(item.weightGrams) || 0) * cleanQuantity(item.quantity);
    }, 0);
    var chargedKg = quantity ? Math.max(1, Math.ceil(totalWeight / 1000)) : 0;
    var shippingCost = quantity ? (area === 'outside' ? 110 : 80) + Math.max(0, chargedKg - 1) * 25 : 0;
    return {
      selectedItems: selected,
      quantity: quantity,
      productTotal: productTotal,
      shippingCost: shippingCost,
      payable: productTotal + shippingCost
    };
  }

  window.TWILIGHT_CART = {
    read: read,
    write: write,
    count: count,
    addItems: addItems,
    updateItem: updateItem,
    removeItem: removeItem,
    clear: clear,
    syncProducts: syncProducts,
    calculate: calculate,
    updateBadges: updateBadges
  };

  updateBadges();
  window.addEventListener('storage', function (event) {
    if (event.key === STORAGE_KEY) updateBadges();
  });
}(window, document));
