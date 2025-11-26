import re

file_path = r'c:\Users\benja\Documents\overgrowthshopify\public\assets\divider_root_transition.svg'

with open(file_path, 'r') as f:
    content = f.read()

# Replace viewBox
# We need to match the PREVIOUSLY modified viewBox or the original if it wasn't modified correctly?
# The file currently has: viewBox="0.00 80.00 1376.00 120.00" preserveAspectRatio="none"
# We want: viewBox="0.00 80.00 1376.00 600.00" preserveAspectRatio="none"

# I'll use a regex that matches the viewBox attribute regardless of its current values
content = re.sub(
    r'viewBox="[^"]+"', 
    'viewBox="0.00 80.00 1376.00 600.00" preserveAspectRatio="none"', 
    content
)

with open(file_path, 'w') as f:
    f.write(content)

print("SVG viewBox updated to 0 80 1376 600.")
