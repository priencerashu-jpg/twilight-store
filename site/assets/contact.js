(function () {
  var form = document.querySelector('[data-contact-form]');
  if (!form) return;
  var error = document.querySelector('[data-contact-error]');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    var values = {
      name: form.elements.name.value.trim(),
      phone: form.elements.phone.value.trim(),
      reason: form.elements.reason.value,
      order: form.elements.order.value.trim(),
      message: form.elements.message.value.trim()
    };
    if (!values.name || !values.phone || !values.reason || !values.message) {
      error.textContent = 'Please complete your name, phone number, reason and message.';
      return;
    }
    error.textContent = '';
    var lines = [
      'Hello Twilight Market, I am contacting you through the website.',
      '',
      'Name: ' + values.name,
      'Phone: ' + values.phone,
      'Reason: ' + values.reason
    ];
    if (values.order) lines.push('Order number: ' + values.order);
    lines.push('', 'Message:', values.message);
    window.open('https://wa.me/8801729624403?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener,noreferrer');
  });
}());
