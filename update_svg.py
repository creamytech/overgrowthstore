import re

file_path = r'c:\Users\benja\Documents\overgrowthshopify\public\assets\btn_primary_growth.svg'

with open(file_path, 'r') as f:
    content = f.read()

# Increase stroke width
content = content.replace('stroke-width="2.00"', 'stroke-width="8.00"')

# Replace all hex colors with cream (#f4f1ea)
# Matches stroke="#......"
content = re.sub(r'stroke="#[0-9a-fA-F]{6}"', 'stroke="#f4f1ea"', content)

with open(file_path, 'w') as f:
    f.write(content)

print("SVG updated successfully.")
