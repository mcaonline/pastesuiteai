/* SSoT for website footer copyright — edit ONLY here. */
(function () {
  var C = 'Keynaptic GmbH';
  var P = 'PasteSuiteAI';
  var S = '2025';
  var Y = '2026';
  var el = document.querySelector('.footer-text');
  if (!el) return;
  el.textContent = el.hasAttribute('data-trademark')
    ? 'Copyright \u00A9 ' + S + '-' + Y + ' ' + C + '. All rights reserved. ' + P + '\u2122 is proprietary software and a trademark of ' + C + '.'
    : 'Copyright \u00A9 ' + S + '-' + Y + ' ' + C + '. All rights reserved.';
})();
