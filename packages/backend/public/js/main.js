const changePage = (e) => {
  e.preventDefault();
  const search = new URLSearchParams(window.location.search);
  search.set('page', e.target.dataset.page);
  window.location.href = `${window.location.origin}${window.location.pathname}?${search.toString()}`;
};

document.querySelectorAll('.pagination a').forEach(item => {
  item.addEventListener('click', changePage);
});