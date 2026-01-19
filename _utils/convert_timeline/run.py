from pathlib import Path

INPUT_FILE = Path("input.txt")
OUTPUT_FILE = Path("output.txt")
FRAME_RATE = 30  # FPS used in LaTeX animate

timeline = []

prev_frame = None
count = 0

with INPUT_FILE.open() as f:
    for line in f:
        line = line.strip()
        if not line:
            continue

        # take last colon-separated field as frame number
        frame = int(line.split(":")[-1])

        if frame == prev_frame:
            count += 1
        else:
            if prev_frame is not None:
                timeline.append({
                    "frame": prev_frame,
                    "duration": count / FRAME_RATE
                })
            prev_frame = frame
            count = 1

# flush last frame
if prev_frame is not None:
    timeline.append({
        "frame": prev_frame,
        "duration": count / FRAME_RATE
    })

# write JS file
with OUTPUT_FILE.open("w") as f:
    f.write("const timeline = [\n")
    for entry in timeline:
        f.write(
            f"  {{ frame: {entry['frame']}, duration: {entry['duration']:.6f} }},\n"
        )
    f.write("];\n")

print(f"✔ Timeline written to {OUTPUT_FILE}")
print(f"✔ {len(timeline)} compressed segments generated")
