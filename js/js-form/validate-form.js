document.addEventListener('DOMContentLoaded', function () {
  var nameEl = document.getElementById('name');
  var celularEl = document.getElementById('celular');
  var cpfEl = document.getElementById('cpf');
  var form = document.querySelector('.auth-form');

  if (nameEl) {
    if (!nameEl.getAttribute('maxlength')) nameEl.setAttribute('maxlength', '100');
    nameEl.addEventListener('input', function () {
      var cleaned = nameEl.value.replace(/[0-9]/g, '');
      if (cleaned !== nameEl.value) nameEl.value = cleaned;
      if (nameEl.maxLength > 0 && nameEl.value.length > nameEl.maxLength) {
        nameEl.value = nameEl.value.slice(0, nameEl.maxLength);
      }
    });
    nameEl.addEventListener('paste', function (e) {
      e.preventDefault();
      var text = (e.clipboardData || window.clipboardData).getData('text') || '';
      text = text.replace(/[0-9]/g, '');
      document.execCommand('insertText', false, text.slice(0, nameEl.maxLength));
    });
  }

  function onlyDigitsHandler(el, maxLen) {
    if (!el) return;
    if (maxLen && !el.getAttribute('maxlength')) el.setAttribute('maxlength', String(maxLen));
    el.addEventListener('input', function () {
      var digits = el.value.replace(/\D/g, '');
      if (maxLen) digits = digits.slice(0, maxLen);
      if (el.value !== digits) el.value = digits;
    });
    el.addEventListener('paste', function (e) {
      e.preventDefault();
      var text = (e.clipboardData || window.clipboardData).getData('text') || '';
      text = text.replace(/\D/g, '');
      document.execCommand('insertText', false, text.slice(0, maxLen || text.length));
    });
  }

  onlyDigitsHandler(celularEl, 11);
  onlyDigitsHandler(cpfEl, 11);

  function createToastContainer() {
    var existing = document.querySelector('.toast-container');
    if (existing) return existing;
    var cont = document.createElement('div');
    cont.className = 'toast-container';
    document.body.appendChild(cont);
    return cont;
  }

  function showToast(message, type) {
    var cont = createToastContainer();
    var t = document.createElement('div');
    t.className = 'toast toast--' + (type || 'info');
    t.textContent = message;
    cont.appendChild(t);
    setTimeout(function () { t.style.opacity = '0'; }, 2600);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 3000);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var isCadastro = !!(document.getElementById('cpf') || document.getElementById('celular'));

      // Validações na ordem do formulário: nome -> e-mail -> celular -> cpf -> senha -> confirmar -> termos
      if (nameEl && nameEl.value.trim().length < 2) { showToast('Informe um nome válido.', 'error'); nameEl.focus(); return; }

      var emailEl = document.getElementById('email');
      var email = emailEl ? emailEl.value.trim() : '';
      var emailRegex = /^\S+@\S+\.\S+$/;
      if (emailEl && !email) { showToast('Informe um e-mail.', 'error'); emailEl.focus(); return; }
      if (emailEl && email && !emailRegex.test(email)) { showToast('Informe um e-mail válido.', 'error'); emailEl.focus(); return; }

      if (celularEl) { if (celularEl.value.length < 10 || celularEl.value.length > 11) { showToast('Celular inválido. Informe 10 ou 11 dígitos.', 'error'); celularEl.focus(); return; } }

      if (cpfEl) { if (cpfEl.value.length !== 11) { showToast('CPF deve conter 11 dígitos.', 'error'); cpfEl.focus(); return; } }

      var passwordEl = document.getElementById('password');
      var confirmEl = document.getElementById('confirm_password');
      if (passwordEl) {
        if (!passwordEl.getAttribute('maxlength')) passwordEl.setAttribute('maxlength', '32');
        if (passwordEl.value.length < 8) { showToast('Senha deve ter ao menos 8 caracteres.', 'error'); passwordEl.focus(); return; }
        if (passwordEl.value.length > Number(passwordEl.getAttribute('maxlength'))) passwordEl.value = passwordEl.value.slice(0, Number(passwordEl.getAttribute('maxlength')));
      }
      if (confirmEl) {
        if (!confirmEl.getAttribute('maxlength')) confirmEl.setAttribute('maxlength', '32');
        if (confirmEl.value.length > Number(confirmEl.getAttribute('maxlength'))) confirmEl.value = confirmEl.value.slice(0, Number(confirmEl.getAttribute('maxlength')));
      }
      if (confirmEl && passwordEl && passwordEl.value !== confirmEl.value) { showToast('Senhas não conferem.', 'error'); confirmEl.focus(); return; }

      var termsEl = document.querySelector('input[name="terms"]');
      if (isCadastro && termsEl && !termsEl.checked) { showToast('Aceite os termos para continuar.', 'error'); termsEl.focus(); return; }

      if (isCadastro) {
        var user = {
          name: nameEl ? nameEl.value.trim() : '',
          email: email,
          cpf: cpfEl ? cpfEl.value : '',
          celular: celularEl ? celularEl.value : '',
          password: passwordEl ? passwordEl.value : ''
        };
        var users = [];
        try { users = JSON.parse(localStorage.getItem('users') || '[]'); } catch (err) { users = []; }
        var exists = users.some(function(u){ return u.email === user.email; });
        if (exists) { showToast('E-mail já cadastrado.', 'error'); return; }
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', user.email);
        showToast('Cadastro realizado com sucesso.', 'success');
        form.reset();
        return;
      }

      // fluxo de login: e-mail -> senha
      var pass = passwordEl ? passwordEl.value : '';
      if (!email) { showToast('Informe um e-mail.', 'error'); if(emailEl) emailEl.focus(); return; }
      if (!pass) { showToast('Informe sua senha.', 'error'); if(passwordEl) passwordEl.focus(); return; }
      var usersList = [];
      try { usersList = JSON.parse(localStorage.getItem('users') || '[]'); } catch (err) { usersList = []; }
      var match = usersList.find(function(u){ return u.email === email && u.password === pass; });
      if (match) { localStorage.setItem('currentUser', email); showToast('Login realizado com sucesso.', 'success'); form.reset(); return; }
      else { showToast('Usuário ou senha incorretos.', 'error'); return; }
    });
  }
});
