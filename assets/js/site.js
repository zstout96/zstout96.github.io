// Builds the contents rail from the page's own <h2> headings and marks
// the section currently in view. No build step, no maintenance.
(function () {
  var rail = document.getElementById('toc');
  var article = document.querySelector('article');
  var aside = rail && rail.closest('.rail');

  function hideRail() {
    if (aside) aside.style.display = 'none';
  }

  if (!rail || !article) return hideRail();

  var heads = Array.prototype.slice.call(article.querySelectorAll('h2'));
  if (heads.length < 3) return hideRail();

  var list = document.createElement('ol');

  heads.forEach(function (h, i) {
    if (!h.id) {
      h.id = (h.textContent || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'section-' + i;
    }
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    li.appendChild(a);
    list.appendChild(li);
  });

  rail.appendChild(list);

  var links = Array.prototype.slice.call(rail.querySelectorAll('a'));

  function mark(id) {
    links.forEach(function (a) {
      a.classList.toggle('here', a.getAttribute('href') === '#' + id);
    });
  }

  if (!('IntersectionObserver' in window)) return;

  var seen = {};
  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        seen[e.target.id] = e.isIntersecting;
      });
      for (var i = 0; i < heads.length; i++) {
        if (seen[heads[i].id]) {
          mark(heads[i].id);
          return;
        }
      }
    },
    { rootMargin: '0px 0px -72% 0px' }
  );

  heads.forEach(function (h) {
    obs.observe(h);
  });
})();
