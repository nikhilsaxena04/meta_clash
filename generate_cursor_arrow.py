from PIL import Image

# Create a 32x32 transparent image
img = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
pixels = img.load()

# Define an 8-bit standard arrow pointer pattern
# 0=empty, 1=border, 2=fill
pattern = [
    " 11             ",
    " 121            ",
    " 1221           ",
    " 12221          ",
    " 122221         ",
    " 1222221        ",
    " 12222221       ",
    " 122222221      ",
    " 1222222221     ",
    " 12222222221    ",
    " 122222222221   ",
    " 122222211111   ",
    " 12221221       ",
    " 1221 1221      ",
    " 121  1221      ",
    " 11    1221     ",
    "        1221    ",
    "         11     "
]

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

draw_pattern(3, 1, (138, 43, 226, 255), (138, 43, 226, 200)) # Purple offset right/up
draw_pattern(1, 3, (255, 20, 147, 255), (255, 20, 147, 200)) # Pink offset down
draw_pattern(2, 2, (255, 255, 255, 255), (20, 10, 30, 255))

img.save('frontend/public/retro-cursor.png')
print("Arrow cursor generated successfully (32x32 size)")
