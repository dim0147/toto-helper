document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json').then((res) => res.json()).then(console.log);
});