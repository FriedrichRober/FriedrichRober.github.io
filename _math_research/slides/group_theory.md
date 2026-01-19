---
title: Group Theory
order: 1
permalink: /math-research/slides/group-theory
scripts:
  - /assets/math_research/group_theory/page_state.js
---

<script
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"
  async
></script>
<script>
  window.MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']]
    },
    options: {
      skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
    }
  };
</script>

<!-- Description container -->
<div class="description" id="description">
  <h1 id="description_header"></h1>
  <p id="description_body"></p>
</div>

<!-- Grid container for animations and captions -->
<div class="grid-container">
  <div class="grid" id="grid_one">
    <div class="cell" id="cell_SO_tetrahedron">
      {% include svg_animation.html id="SO_tetrahedron" base="assets/math_research/group_theory/SO_tetrahedron" %}
      <div class="caption">Tetrahedron</div>
    </div>
    <div class="cell" id="cell_SO_square">
      {% include svg_animation.html id="SO_square" base="assets/math_research/group_theory/SO_square" %}
      <div class="caption">Square</div>
    </div>
    <div class="cell" id="cell_card_shuffle">
    {% include svg_animation.html id="card_shuffle" base="assets/math_research/group_theory/card_shuffle" %}
    <div class="caption">Card Shuffle</div>
    </div>
  </div>

<button id="next_state_btn" class="page_next_btn">Next →</button>

</div>

<style>
  #grid_one {
    display: none;
  }
</style>
