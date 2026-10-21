/* Site-wide analytics and lead-form helpers for andrewhillrealtor.com.
   GA4 Measurement ID for the andrewhillrealtor.com web stream
   (GA4 > Admin > Data streams > the web stream > Measurement ID).
   If GA_ID is ever reset to the G-XXXXXXXXXX placeholder, nothing loads.

   Events (no form contents, names, phone numbers, emails or addresses are ever sent):
   - page_view       automatic
   - generate_lead   each page's form script, only after FormSubmit confirms delivery; form_id names the form
   - form_start      first interaction with a lead form; form_id
   - form_error      reason = validation | send_failed; form_id
   - phone_click     any tel: link (link_url is Andrew's own number)
   - sms_click       any sms: link
   - email_click     any mailto: link
   - cta_click       any element with class "track"; cta_id = its data-event
   - outbound_click  links to other sites; link_domain only (e.g. dashcarolina.com home search)
   Key events to mark in GA4 > Admin > Events: generate_lead, phone_click, sms_click. */
(function () {
  var GA_ID = 'G-36TBN94MMP';

  /* Shared validation for every form.lead-form. Requires the browser-level
     "required" fields, plus at least one field in any data-one-of group
     (phone or email). Returns true when the form may be sent. */
  window.ahValidateLeadForm = function (form) {
    var ok = form.checkValidity();
    var groups = {};
    form.querySelectorAll('[data-one-of]').forEach(function (el) {
      var g = el.getAttribute('data-one-of');
      groups[g] = groups[g] || [];
      groups[g].push(el);
    });
    Object.keys(groups).forEach(function (g) {
      var els = groups[g];
      var filled = els.some(function (el) { return el.value.trim() !== ''; });
      els.forEach(function (el) { el.setCustomValidity(filled ? '' : 'Please enter a phone number or an email.'); });
      if (!filled) ok = false;
    });
    if (!ok) {
      form.reportValidity();
      track('form_error', { form_id: formId(form), reason: 'validation' });
    }
    return ok;
  };
  document.addEventListener('input', function (e) {
    var el = e.target;
    if (el && el.hasAttribute && el.hasAttribute('data-one-of')) {
      el.form.querySelectorAll('[data-one-of="' + el.getAttribute('data-one-of') + '"]').forEach(function (x) { x.setCustomValidity(''); });
    }
  });

  function formId(form) {
    var b = form.querySelector('button[type="submit"]');
    return (b && b.dataset.event) || form.id || 'lead_form';
  }
  function track(name, params) {
    params = params || {};
    params.page_path = location.pathname;
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
  }

  if (!/X{6}/.test(GA_ID)) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }

  var started = new WeakSet();
  document.addEventListener('focusin', function (e) {
    var form = e.target.closest && e.target.closest('form.lead-form');
    if (!form || started.has(form)) return;
    started.add(form);
    track('form_start', { form_id: formId(form) });
  });

  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('a, button');
    if (!el) return;
    var href = el.getAttribute('href') || '';
    if (href.indexOf('tel:') === 0) { track('phone_click', { link_url: href }); return; }
    if (href.indexOf('sms:') === 0) { track('sms_click', { link_url: href.split('?')[0] }); return; }
    if (href.indexOf('mailto:') === 0) { track('email_click', { link_url: href.split('?')[0] }); return; }
    if (el.classList.contains('track') && el.dataset.event) track('cta_click', { cta_id: el.dataset.event });
    if (/^https?:\/\//.test(href)) {
      var host = '';
      try { host = new URL(href).hostname.replace(/^www\./, ''); } catch (err) {}
      if (host && host !== location.hostname.replace(/^www\./, '')) track('outbound_click', { link_domain: host, cta_id: el.dataset.event || '' });
    }
  });
})();
