import glob
import os
import xml.etree.ElementTree as ET

input_dir = "frames"
output_file = "sprite.svg"

frames = sorted(glob.glob(os.path.join(input_dir, "frame_*.svg")))
if not frames:
    raise RuntimeError("No frame_*.svg files found in input directory")

# Parse first SVG to get viewBox
tree0 = ET.parse(frames[0])
root0 = tree0.getroot()
viewBox = root0.attrib.get("viewBox")
if viewBox is None:
    raise RuntimeError("First SVG has no viewBox")

sprite = ET.Element(
    "svg",
    {
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": viewBox,
    },
)

for i, filename in enumerate(frames):
    tree = ET.parse(filename)
    root = tree.getroot()

    frame_id = os.path.splitext(os.path.basename(filename))[0]

    g = ET.SubElement(
        sprite,
        "g",
        {
            "id": frame_id,
            "display": "inline" if i == 0 else "none",
        },
    )

    # Copy all children (paths, groups, etc.)
    for child in list(root):
        g.append(child)

ET.ElementTree(sprite).write(
    output_file,
    encoding="utf-8",
    xml_declaration=True,
)
