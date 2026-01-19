---
title: Math Research
scripts:
  - /assets/js/init_hover_cells.js
---

From my Bachelor's Thesis onwards I took a strong interest in **Computational Group Theory**,
as it combines two things I love: **Algebra** and **Algorithms**.

## Publications

For Algorithms there are two sides to the story: The **Theoretical Analysis** and the **Practical Implementation**.
I always enjoyed diving into both of these two worlds as each provides interesting challenges and insights.
For more on this, see my [journal publications and software packages](main/publications).

## Presentations

Collaboration is key in research, and a very important aspect for establishing connections is attending conferences and giving talks. **Presenting your own work** in an intuitive and enjoyable way helps your audience understand your work and remember it. I invite you to have a look at this short, animated lecture-style slide show:

<div class="grid">
  <div class="cell hover" id="cell_SO_square">
    <a href="{{ 'math-research/slides/group-theory' | relative_url }}">
    {% include svg_animation.html id="SO_square" base="assets/math_research/group_theory/SO_square" %}
    <div class="caption">Group Theory</div>
    </a>
  </div>
</div>

<div style="height: 1.5em;"></div>

You can also download a
<a href="{{ site.baseurl }}/assets/pdfs/friedrich-rober-research-presentation.pdf" download>
  PDF presentation obout my research.
</a>
In order to see the animations, you need a PDF viewer that is capable of displaying MP4 files, for example Adobe Acrobat Reader.

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