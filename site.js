'use strict';

const projectDialog = document.querySelector('#project-dialog');
const projectButtons = [...document.querySelectorAll('[data-project]')];
const projectDescriptions = [
  'A closer look at a digital wallet interface, exploring how information, interaction and visual character come together in a product experience. Presented as a portfolio study; client credits and project outcomes are not yet published.',
  'An exploration of identity through a restaurant menu and printed touchpoints. Presented as a portfolio study; client credits, project scope and outcomes are not yet published.',
  ...Array(5).fill('A selected visual study from the Nuclear portfolio. Explore the original composition in detail. Client credits, project scope and outcomes are not yet published.')
];

projectButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    const image = button.querySelector('img');
    const dialogImage = document.querySelector('#dialog-image');
    dialogImage.src = image.currentSrc || image.src;
    dialogImage.alt = image.alt;
    document.querySelector('#dialog-title').textContent = button.querySelector('h3').textContent;
    document.querySelector('#dialog-category').textContent = button.querySelector('.project__info p').textContent;
    document.querySelector('#dialog-description').textContent = projectDescriptions[index];
    projectDialog.showModal();
    document.body.classList.add('dialog-open');
    projectDialog.scrollTop = 0;
  });
});

projectDialog.querySelector('.dialog__close').addEventListener('click', () => projectDialog.close());
projectDialog.addEventListener('click', event => {
  if (event.target !== projectDialog) return;
  const bounds = projectDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) projectDialog.close();
});
projectDialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
projectDialog.querySelector('.dialog__cta').addEventListener('click', event => {
  event.preventDefault();
  projectDialog.close();
  document.querySelector('#contact').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  document.querySelector('[name="name"]').focus({ preventScroll: true });
});

const filters = [...document.querySelectorAll('[data-filter]')];
const projects = [...document.querySelectorAll('.project')];
filters.forEach(filter => {
  filter.addEventListener('click', () => {
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === filter)));
    let visible = 0;
    projects.forEach(project => {
      project.hidden = filter.dataset.filter !== 'all' && project.dataset.category !== filter.dataset.filter;
      if (!project.hidden) visible++;
    });
    document.querySelector('.work__count').textContent = `${String(visible).padStart(2, '0')} project${visible === 1 ? '' : 's'}`;
  });
});

document.querySelectorAll('[data-interest]').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('#project-interest').value = link.dataset.interest;
  });
});

const contactStatus = document.querySelector('#contact-status');
const projectForm = document.querySelector('#project-form');
const copyBriefButton = document.querySelector('#copy-brief');
let preparedBrief = '';

async function copyText(text, successMessage) {
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(text);
    contactStatus.textContent = successMessage;
  } catch {
    contactStatus.textContent = 'Automatic copying is unavailable. Select and copy the text below.';
    const manualCopy = document.createElement('textarea');
    manualCopy.className = 'manual-copy';
    manualCopy.setAttribute('aria-label', 'Text to copy manually');
    manualCopy.value = text;
    manualCopy.readOnly = true;
    manualCopy.style.cssText = 'grid-column:1/-1;width:100%;min-height:8rem;background:#191919;color:#fff;padding:1rem;border:1px solid #555';
    projectForm.querySelector('.manual-copy')?.remove();
    projectForm.append(manualCopy);
    manualCopy.focus();
    manualCopy.select();
  }
}

document.querySelector('#copy-email').addEventListener('click', () => copyText('contact@nuclearlabs.design', 'Email address copied.'));
projectForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(projectForm);
  const name = String(data.get('name')).trim();
  const email = String(data.get('email')).trim();
  const message = String(data.get('message')).trim();
  if (!name || message.length < 10) {
    contactStatus.textContent = 'Please add your name and at least 10 characters about your project.';
    projectForm.elements[!name ? 'name' : 'message'].focus();
    return;
  }
  const interest = String(data.get('interest'));
  preparedBrief = `Hello Nuclear,\n\n${message}\n\nProject: ${interest}\nName: ${name}\nEmail: ${email}`;
  const subject = `Project enquiry — ${interest}`;
  const mailto = `mailto:contact@nuclearlabs.design?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(preparedBrief)}`;
  copyBriefButton.hidden = false;
  contactStatus.textContent = 'Your brief is ready. If no email app opens, copy the brief and email contact@nuclearlabs.design. Your message has not been sent.';
  window.location.href = mailto;
});
copyBriefButton.addEventListener('click', () => copyText(preparedBrief, 'Project brief copied. Paste it into an email to contact@nuclearlabs.design.'));
document.querySelector('#current-year').textContent = new Date().getFullYear();
