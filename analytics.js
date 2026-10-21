/* Site-wide Google Analytics 4 loader for andrewhillrealtor.com.
   To turn tracking on, replace G-XXXXXXXXXX below with the GA4 Measurement ID
   (GA4 > Admin > Data streams > the web stream > Measurement ID).
   While the placeholder is here, nothing loads and nothing is tracked.

   Events sent once live:
   - page_view          (automatic)
   - lead_submit        (fired by each page's form script after FormSubmit confirms delivery)
   - phone_click        (any tel: link)
   - email_click        (any mailto: link)
   Mark lead_submit and phone_click as key events in GA4 > Admin > Events. */
(function () {
  var GA_ID = 'G-XXXXXXXXXX';
  if (/X{6}/.test(GA_ID)) return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="tel:"], a[href^="mailto:"]');
    if (!a) return;
    var tel = a.getAttribute('href').indexOf('tel:') === 0;
    window.gtag('event', tel ? 'phone_click' : 'email_click', {
      link_url: a.getAttribute('href'),
      page_path: location.pathname
    });
  });
})();
