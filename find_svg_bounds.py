import re
import sys

def get_precise_bbox(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Normalize content
    content = re.sub(r'\s+', ' ', content)
    
    # Find all path d attributes
    paths = re.findall(r'd="([^"]+)"', content)
    
    all_x = []
    all_y = []
    
    for path in paths:
        # Split by commands
        # Commands: M, L, H, V, C, S, Q, T, A, Z (case insensitive)
        # We only care about absolute coordinates for simplicity, assuming the file uses them (which it seems to)
        # The file uses M, L, Q, C, A. All seem to be absolute (uppercase).
        
        # Regex to find all numbers
        nums = [float(n) for n in re.findall(r'[-+]?\d*\.\d+|[-+]?\d+', path)]
        
        # This is still a bit rough because A command has radii and rotation which are not coordinates.
        # A rx ry x-axis-rotation large-arc-flag sweep-flag x y
        # The last two are x y.
        # Q x1 y1 x y. Last two are x y.
        # C x1 y1 x2 y2 x y. Last two are x y.
        # L x y.
        # M x y.
        
        # It seems safe to just take ALL numbers and filter by range?
        # No, radii can be small. Rotation is 0 or small. Flags are 0 or 1.
        # Coordinates are likely > 80 for Y and > 0 for X.
        
        # Let's try to parse the commands.
        # We can split the string by letters.
        commands = re.findall(r'([a-zA-Z])([^a-zA-Z]*)', path)
        
        for cmd, args in commands:
            args_nums = [float(n) for n in re.findall(r'[-+]?\d*\.\d+|[-+]?\d+', args)]
            
            if cmd.upper() == 'M' or cmd.upper() == 'L':
                # x y pairs
                for i in range(0, len(args_nums), 2):
                    if i+1 < len(args_nums):
                        all_x.append(args_nums[i])
                        all_y.append(args_nums[i+1])
            elif cmd.upper() == 'Q':
                # x1 y1 x y
                for i in range(0, len(args_nums), 4):
                    if i+3 < len(args_nums):
                        all_x.append(args_nums[i]) # Control point
                        all_y.append(args_nums[i+1])
                        all_x.append(args_nums[i+2]) # End point
                        all_y.append(args_nums[i+3])
            elif cmd.upper() == 'C':
                # x1 y1 x2 y2 x y
                for i in range(0, len(args_nums), 6):
                    if i+5 < len(args_nums):
                        all_x.append(args_nums[i])
                        all_y.append(args_nums[i+1])
                        all_x.append(args_nums[i+2])
                        all_y.append(args_nums[i+3])
                        all_x.append(args_nums[i+4])
                        all_y.append(args_nums[i+5])
            elif cmd.upper() == 'A':
                # rx ry rot large sweep x y
                for i in range(0, len(args_nums), 7):
                    if i+6 < len(args_nums):
                        all_x.append(args_nums[i+5])
                        all_y.append(args_nums[i+6])
                        # Ignore radii and flags
            elif cmd.upper() == 'Z':
                pass
            
    if not all_x or not all_y:
        print("No coordinates found")
        return

    min_x, max_x = min(all_x), max(all_x)
    min_y, max_y = min(all_y), max(all_y)
    
    print(f"BBox: X({min_x} to {max_x}), Y({min_y} to {max_y})")

get_precise_bbox('c:/Users/benja/Documents/overgrowthshopify/public/assets/divider_root_transition.svg')
