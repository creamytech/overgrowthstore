import re
import sys

def get_svg_bbox(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Extract all coordinates
    # Look for M x y, L x y, Q x1 y1 x y, C x1 y1 x2 y2 x y, A rx ry rot large sweep x y
    # This is a rough regex, might need refinement for complex paths but good for estimation
    
    # Normalize path data: remove newlines, extra spaces
    content = re.sub(r'\s+', ' ', content)
    
    # Find all path d attributes
    paths = re.findall(r'd="([^"]+)"', content)
    
    min_x, min_y = float('inf'), float('inf')
    max_x, max_y = float('-inf'), float('-inf')
    
    for path in paths:
        # Extract all numbers
        nums = [float(n) for n in re.findall(r'[-+]?\d*\.\d+|[-+]?\d+', path)]
        
        # In SVG paths, coordinates are usually pairs. 
        # This simple extraction ignores commands but gets all points.
        # It's sufficient for bounding box if we assume all numbers are coordinates or radii (which are usually smaller than coords)
        # But control points and radii are also dimensions.
        
        # A safer way is to just look at all numbers and find min/max. 
        # It might include arc radii or rotation flags, but min/max x/y usually dominates.
        # Let's try to be slightly smarter: separate X and Y? No, commands mix them.
        # But generally, for this specific file, it seems to be mostly absolute coordinates.
        
        # Let's just dump all numbers and see min/max.
        for i in range(0, len(nums)):
            val = nums[i]
            # Heuristic: X coordinates in this file seem to be 0-1400, Y seem to be 80-700?
            # If we just take min/max of everything, we might mix X and Y.
            pass

        # Let's try to parse pairs.
        # This is hard without a full parser.
        # Let's just look at the file content I read earlier.
        # Y values were around 80-170.
        pass

    # Let's use a simpler approach: Regex for specific commands if possible, or just all numbers and assume range.
    # Actually, I can just read the file and print the min/max of numbers found after specific commands.
    
    # Better: just use the previously viewed file content to estimate.
    # I saw Y values like 85.92, 172.08.
    # I didn't see any Y values like 600.
    
    # Let's write a script that specifically parses the numbers and prints stats.
    all_numbers = []
    for path in paths:
        nums = [float(n) for n in re.findall(r'[-+]?\d*\.\d+|[-+]?\d+', path)]
        all_numbers.extend(nums)
        
    if not all_numbers:
        print("No numbers found")
        return

    print(f"Total numbers: {len(all_numbers)}")
    print(f"Min: {min(all_numbers)}")
    print(f"Max: {max(all_numbers)}")
    
    # Let's try to separate X and Y by assuming alternating, which is NOT true for all commands (e.g. A, V, H)
    # But this file seems to use M, L, Q, C, A.
    # M x y
    # L x y
    # Q x1 y1 x y
    # C x1 y1 x2 y2 x y
    # A rx ry rot large sweep x y
    
    # It's safer to just look at the distribution.
    # X is likely 0-1400. Y is likely 0-800.
    
    xs = []
    ys = []
    
    # This is a hacky parser
    # We will iterate through the string and track command
    
    # Actually, let's just use the fact that I can read the file.
    # I will just print the min/max of ALL numbers and deduce.
    pass

get_svg_bbox('c:/Users/benja/Documents/overgrowthshopify/public/assets/divider_root_transition.svg')
