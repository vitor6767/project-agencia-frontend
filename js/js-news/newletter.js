// Handler da newsletter: reutiliza `showToast` definido em `validate-form.js`
	document.addEventListener('DOMContentLoaded', () => {
		const newsletterForm = document.querySelector('.newsletter-form');
		if (!newsletterForm) return;

		const submitBtn = newsletterForm.querySelector('button');
		const emailInput = newsletterForm.querySelector('input[type="email"]');

		submitBtn.addEventListener('click', (e) => {
			e.preventDefault();
			const email = emailInput ? emailInput.value.trim() : '';
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

			if (!email) {
				if (window && typeof window.showToast === 'function') window.showToast('Informe um e-mail.', 'error');
				else createFallbackToast('Informe um e-mail.', 'error');
				return;
			}

			if (!emailRegex.test(email)) {
				if (window && typeof window.showToast === 'function') window.showToast('Por favor, insira um e-mail válido', 'error');
				else createFallbackToast('Por favor, insira um e-mail válido', 'error');
				return;
			}

			// sucesso — garantir cor verde (usa showToast quando disponível)
			if (window && typeof window.showToast === 'function') {
				window.showToast('Inscrição enviada', 'success');
			} else {
				createFallbackToast('Inscrição enviada', 'success');
			}
			if (emailInput) emailInput.value = '';
		});

		function createFallbackToast(message, type) {
			const contClass = 'toast-container';
			let cont = document.querySelector('.' + contClass);
			if (!cont) {
				cont = document.createElement('div');
				cont.className = contClass;
				Object.assign(cont.style, { position: 'fixed', right: '1rem', bottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 9999 });
				document.body.appendChild(cont);
			}

			const t = document.createElement('div');
			t.className = 'toast';
			t.textContent = message;
			Object.assign(t.style, { color: '#fff', padding: '0.75rem 1rem', borderRadius: '8px', fontWeight: 600, boxShadow: '0 6px 18px rgba(0,0,0,0.08)' });
			if (type === 'success') t.style.background = 'linear-gradient(90deg,#2bb673,#1fa65a)';
			else if (type === 'error') t.style.background = 'linear-gradient(90deg,#ff6b6b,#ff4c4c)';

			cont.appendChild(t);
			setTimeout(function () { t.style.opacity = '0'; }, 2600);
			setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 3000);
		}
	});
