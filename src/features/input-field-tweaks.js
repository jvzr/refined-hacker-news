import fitTextarea from 'fit-textarea';

import {newReplyTextareasObserver} from '../libs/dom-utils';
import {paths} from '../libs/paths';

// Dynamically change textarea height
function watchTextareas() {
	const textareas = document.querySelectorAll('textarea');

	for (const textarea of textareas) {
		fitTextarea.watch(textarea);
	}

	newReplyTextareasObserver(event => {
		fitTextarea.watch(event.target);
	});
}

// Dynamically increase / decrease title field length
function dynamicallyChangeWidth() {
	if (['/reply', ...paths.comments].includes(window.location.pathname)) {
		return;
	}

	const titleInput = document.querySelector('input[name="title"]');
	titleInput.style.width = '49ch';

	titleInput.addEventListener('input', () => {
		const {length} = titleInput.value;
		titleInput.style.width = length < 49 ? '49ch' : (length + 1) + 'ch';
	});
}

// Show characters remaining beside title field
function charactersRemainging() {
	if (['/reply', '/newpoll', ...paths.comments].includes(window.location.pathname)) {
		return;
	}

	const titleInput = document.querySelector('input[name="title"]');
	const titleLengthLimit = 80;

	const span = document.createElement('span');
	span.classList.add('__rhn__characters-under');
	titleInput.nextElementSibling.classList.add('__rhn__characters-over');
	titleInput.parentElement.append(span);

	titleInput.addEventListener('input', () => {
		const {length} = titleInput.value;

		span.innerHTML = length <= titleLengthLimit ?
			`${titleLengthLimit - length} remaining` :
			'';
	});
}

function init() {
	watchTextareas();
	dynamicallyChangeWidth();
	charactersRemainging();

	return true;
}

const details = {
	id: 'input-field-tweaks',
	pages: {
		include: [
			...paths.forms,
			...paths.comments
		],
		exclude: [
			'/delete-confirm',
			'/changepw'
		]
	},
	loginRequired: false,
	init
};

export default details;
