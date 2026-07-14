import '../css/main.css';

function init() {
	document.documentElement.classList.add('js');
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}
