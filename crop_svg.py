import re

file_path = r'c:\Users\benja\Documents\overgrowthshopify\public\assets\divider_root_transition.svg'

with open(file_path, 'r') as f:
    content = f.read()

# Replace viewBox
# Original: viewBox="0.00 0.00 1376.00 768.00"
# Target: viewBox="0.00 80.00 1376.00 120.00" preserveAspectRatio="none"

content = re.sub(
    r'viewBox="0\.00 0\.00 1376\.00 768\.00"', 
    'viewBox="0.00 80.00 1376.00 120.00" preserveAspectRatio="none"', 
    content
)

with open(file_path, 'w') as f:
    f.write(content)

print("SVG viewBox updated successfully.")
