# Import a LaTeX animation

## Step 0

Compile PDF from LaTeX source code

## Step 1

Split PDF into single-page PDFs

```bash
mkdir name
pdfseparate name.pdf name/frame_%03d.pdf

cd name
for f in frame_*.pdf; do
  # Extract the number
  num=$(echo "$f" | grep -o '[0-9]\+')
  # Subtract 1
  newnum=$(printf "%03d" $((10#$num - 1)))
  # Rename the file
  mv "$f" "frame_${newnum}.pdf"
done
```

## Step 2

Convert PDF to SVG

```bash
mkdir _SVGs
for f in frame_*.pdf; do
    inkscape  "${f}" --export-type=svg --export-filename="_SVGs/${f%.pdf}.svg"
done
```

## Step 3

Move `frame_000.svg` to `assets/.../name/preview.svg`

## Step 4

Merge SVGs into single SVG sprite.

```bash
cd utils/convert_frames_to_sprite
```

Paste frames into `utils/convert_frames_to_sprite/frames`.

```bash
python run.py
```

Move `sprite.svg` to `assets/.../name/sprite.svg`

## Step 5

Convert LaTeX animate timeline into JS timeline:

```bash
cd utils/convert_timeline
```

Paste timeline into `input.txt`.

```bash
python run.py
```

Add `output.txt` to `assets/.../name/timeline.js`, but change `const timeline = [...]` to `window.name_timeline = []`.

## Step 6

In website MD file add:
```md
{% include svg_animation.html
   id="name"
   base="assets/.../name"
   size="350px"
   sync=true
%}
```
