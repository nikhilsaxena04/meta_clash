from PIL import Image, ImageDraw

# Create a 32x32 transparent image
img = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
pixels = img.load()

# Define an 8-bit pointer hand pattern (0=empty, 1=fill, 2=border)
# A classic hand pointer
pattern = [
    "      11        ",
    "     1221       ",
    "     1221       ",
    "     1221       ",
    "     1221       ",
    "     122111     ",
    "    112222211   ",
    "   12122222221  ",
    "  1221222222221 ",
    "  1222222222221 ",
    "  1222222222221 ",
    "   12222222221  ",
    "   1222222221   ",
    "    12222221    ",
    "     122221     ",
    "      1111      "
]

# We want a glitch effect: pink shadow slightly right/down, cyan shadow slightly left/up
# Then the main hand (dark center, white border)

def draw_pattern(offset_x, offset_y, color_1, color_2):
    for y, row in enumerate(pattern):
        for x, char in enumerate(row):
            if char == '1':
                # border
                px = x + offset_x
                py = y + offset_y
                if 0 <= px < 32 and 0 <= py < 32:
                    pixels[px, py] = color_1
            elif char == '2':
                # fill
                px = x + offset_x
                py = y + offset_y
                if 0 <= px < 32 and 0 <= py < 32:
                    pixels[px, py] = color_2

# Glitch pink (offset +1, +1)
draw_pattern(2, 2, (255, 0, 255, 200), (255, 0, 255, 100))
# Glitch cyan (offset -1, -1)
draw_pattern(0, 0, (0, 255, 255, 200), (0, 255, 255, 100))
# Main hand (offset 1, 1) - Border white, fill very dark purple
draw_pattern(1, 1, (255, 255, 255, 255), (20, 10, 30, 255))

# Upscale by 2x for a chunky 8-bit look without blur
img = img.resize((64, 64), Image.NEAREST)

img.save('frontend/public/retro-cursor.png')
print("Cursor generated successfully")
