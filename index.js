document.addEventListener('DOMContentLoaded', () => {
  fetch('https://en.lottolyzer.com/history/singapore/toto/page/1/per-page/50/summary-view').then((res) => res.text()).then(console.log);
});