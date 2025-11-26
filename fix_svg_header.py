
path = 'public/assets/divider_root_transition.svg'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix duplicate attribute and remove preserveAspectRatio to prevent stretching
new_content = content.replace(' preserveAspectRatio="none"', '')

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Fixed SVG header")
