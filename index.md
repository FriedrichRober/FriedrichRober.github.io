---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: About
layout: main
scripts:
  - /assets/js/init_hover_cells.js
---

I am a phd graduate in mathematics from RWTH Aachen University with a strong interest in Computational Algebra, in particular Computational Group Theory. In my free time I like to travel and to paint.

Feel free to explore my website by clicking on the links in the navigation above or check out my short, animated lecture-style slide show on group theory:

<div class="grid">
  <div class="cell hover" id="cell_SO_square">
    <a href="{{ '/math-research/slides/group-theory' | relative_url }}">
    {% include svg_animation.html id="SO_square" base="assets/math_research/group_theory/SO_square" %}
    <div class="caption">Group Theory</div>
    </a>
  </div>
</div>

<style>
.hover a {
  text-decoration: none;
  color: inherit;
  display: contents;
  margin: 0;
  padding: 0;
}

.caption {
  text-decoration: underline;
}

.hover {
  filter: grayscale(100%);
  transition: filter 0.3s ease;
  cursor: pointer;
}

.hover:hover {
  filter: grayscale(0%);
}
</style>
