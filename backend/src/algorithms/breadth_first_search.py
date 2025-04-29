import numpy as np
import time
from collections import deque
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

# Direction mappings
direction_map = {
    "N": (-1, 0),
    "S": (1, 0),
    "E": (0, 1),
    "W": (0, -1),
}

# Turn mappings
left_turn = {"N": "W", "W": "S", "S": "E", "E": "N"}
right_turn = {"N": "E", "E": "S", "S": "W", "W": "N"}

def bfs(queue, grid, number_of_moves):
    start_time = time.time()

    visited = dict()  # Tracks best scan count for each (x, y, direction)
    best_path = []
    best_coverage = 0.0
    best_path_len = 0

    total_cells = np.sum(grid == 0)
    scan_cache = {}  # Cache scan results to avoid recomputation

    while queue:
        x, y, direction, path, scanned = queue.popleft()

        # Cache scan area if not already done
        key = (x, y, direction)
        if key not in scan_cache:
            scan_cache[key] = get_scan_area(x, y, direction, grid)

        # Merge scanned area
        new_scanned = scanned | scan_cache[key]
        scan_count = len(new_scanned)
        coverage = (scan_count / total_cells) * 100.0 if total_cells > 0 else 0.0

        # Skip if this state has already been visited with equal or better scanned count
        if key in visited and scan_count <= visited[key]:
            continue
        visited[key] = scan_count

        # Track best result
        if coverage > best_coverage or (coverage == best_coverage and len(path) < best_path_len):
            best_coverage = coverage
            best_path = path
            best_path_len = len(path)

        # End conditions
        if len(path) >= number_of_moves:
            continue
        if coverage >= 80.0:
            break

        # Explore next moves
        next_moves = get_valid_moves(x, y, direction, grid, {p[:2] for p in path})
        scored_moves = []

        for nx, ny, ndir in next_moves:
            move_key = (nx, ny, ndir)
            if move_key not in scan_cache:
                scan_cache[move_key] = get_scan_area(nx, ny, ndir, grid)
            future_gain = len(scan_cache[move_key] - new_scanned)
            if future_gain > 0:  # Skip moves that add no new scans
                scored_moves.append((move_key, future_gain))

        # Prioritize high-gain scan moves
        scored_moves.sort(key=lambda item: -item[1])
        for (nx, ny, ndir), _ in scored_moves:
            queue.append((
                nx,
                ny,
                ndir,
                path + [(nx, ny, ndir)],
                new_scanned
            ))

    return best_path, (time.time() - start_time), best_coverage, best_path_len

def get_scan_area(x, y, direction, grid):
    """ Returns set of (x, y) positions scanned from aircraft position/direction """
    scanned_cells = set()
    dx, dy = direction_map[direction]

    for i in range(1, 3):  # Rows ahead
        for j in [-1, 0, 1]:  # 3 columns wide
            sx, sy = x + dx * i, y + dy * i + j
            if 0 <= sx < grid.shape[0] and 0 <= sy < grid.shape[1]:
                if grid[sx][sy] == 0:
                    scanned_cells.add((sx, sy))
    return scanned_cells

def get_valid_moves(x, y, direction, grid, visited):
    """ Returns valid (x, y, direction) positions the aircraft can move to """
    valid_moves = []
    dx, dy = direction_map[direction]

    # Forward
    fx, fy = x + dx, y + dy
    if is_valid_cell(fx, fy, grid, visited):
        valid_moves.append((fx, fy, direction))

    # Left turn
    left_dir = left_turn[direction]
    lx, ly = x + direction_map[left_dir][0], y + direction_map[left_dir][1]
    if is_valid_cell(lx, ly, grid, visited):
        valid_moves.append((lx, ly, left_dir))

    # Right turn
    right_dir = right_turn[direction]
    rx, ry = x + direction_map[right_dir][0], y + direction_map[right_dir][1]
    if is_valid_cell(rx, ry, grid, visited):
        valid_moves.append((rx, ry, right_dir))

    return valid_moves

def is_valid_cell(x, y, grid, visited):
    """ Returns True if cell is traversable and not already visited """
    return (0 <= x < grid.shape[0]) and (0 <= y < grid.shape[1]) and \
           grid[x][y] == 0 and (x, y) not in visited

def run_breadth_algorithm(grid, start_position, number_of_moves):
    """
    Initializes and runs the optimized BFS algorithm.
    """
    start_x, start_y = start_position
    start_direction = "E"

    queue = deque([
        (start_x, start_y, start_direction, [(start_x, start_y, start_direction)], set())
    ])

    path_taken, time_taken, coverage, path_len = bfs(queue, grid, number_of_moves)
    return path_taken, time_taken, coverage, path_len, number_of_moves
