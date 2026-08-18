(function () {
  var form = document.querySelector('[data-contact-form]');
  if (!form) return;
  var errorNode = document.querySelector('[data-contact-error]');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var values = {
      name: form.elements.name.value.trim(),
      phone: form.elements.phone.value.trim(),
      email: form.elements.email.value.trim(),
      reason: form.elements.reason.value,
      order: form.elements.order.value.trim(),
      message: form.elements.message.value.trim()
    };
    if (!values.name || !values.phone || !values.reason || !values.message) {
      errorNode.textContent = 'Enter your name, phone number, reason for contact and message.';
      return;
    }
    errorNode.textContent = '';
    var lines = [
      'Hello Twilight Market, I would like support.',
      '',
      'Name: ' + values.name,
      'Phone: ' + values.phone,
      'Reason: ' + values.reason
    ];
    if (values.email) lines.push('Email: ' + values.email);
    if (values.order) lines.push('Order number: ' + values.order);
    lines.push('', 'Message:', values.message);
    window.open('https://wa.me/8801729624403?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener,noreferrer');
  });
}());
