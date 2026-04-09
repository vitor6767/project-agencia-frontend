document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.toggle-password').forEach(function (cb) {
    cb.addEventListener('change', function () {
      var targets = (cb.dataset.target || '').split(',');
      targets.forEach(function (sel) {
        sel = sel.trim();
        if (!sel) return;
        document.querySelectorAll(sel).forEach(function (el) {
          if (el.type === 'password' || el.type === 'text') {
            el.type = cb.checked ? 'text' : 'password';
          }
        });
      });
    });
  });
});
