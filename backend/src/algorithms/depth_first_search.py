import numpy as np
import time
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

# direction mappings
direction_map = {
    "N": (-1, 0),
    "S": (1, 0),
    "E": (0, 1),
    "W": (0, -1),
}

# Left and right turn mappings
left_turn = {"N": "W", "W": "S", "S": "E", "E": "N"}
right_turn = {"N": "E", "E": "S", "S": "W", "W": "N"}

def dfs(stack, grid):
    """
    Iterative DFS to explore the grid while maximizing scan coverage.
    :param stack: list - [(x, y, direction, path)]
    :param grid: np.array - represents the grid
    :return: path taken, time taken, coverage, path length
    """
    start_time = time.time()

    visited = set()
    scanned = set()
    path = []

    while stack:
        x, y, direction, path = stack.pop()

        if (x, y) in visited:
            continue
        visited.add((x, y))

        # Scan 2x3 area
        scan_area = get_scan_area(x, y, direction, grid)
        scanned.update(scan_area)

        # Get valid next moves
        next_moves = get_valid_moves(x, y, direction, grid, visited)
        for next_x, next_y, next_dir in next_moves:
            stack.append((next_x, next_y, next_dir, path + [(next_x, next_y, next_dir)]))

    scanned_cells = len(scanned)
    total_cells = np.sum(grid == 0)
    coverage = (scanned_cells / total_cells) * 100.0 if total_cells > 0 else 0.0

    path_len = len(path)

    return path, (time.time() - start_time), coverage, path_len


def get_scan_area(x, y, direction, grid):
    scanned_cells = set()
    dx, dy = direction_map[direction]

    for i in range(1, 3):
        for j in [-1, 0, 1]:
            scanned_x, scanned_y = x + dx * i, y + dy * i + j
            if 0 <= scanned_x < grid.shape[0] and 0 <= scanned_y < grid.shape[1]:
                if grid[scanned_x][scanned_y] == 0:
                    scanned_cells.add((scanned_x, scanned_y))
    return scanned_cells


def get_valid_moves(x, y, direction, grid, visited):
    valid_moves = []
    dx, dy = direction_map[direction]

    # Forward
    fx, fy = x + dx, y + dy
    if is_valid_cell(fx, fy, grid, visited):
        valid_moves.append((fx, fy, direction))

    # Left
    left_dir = left_turn[direction]
    lx, ly = x + direction_map[left_dir][0], y + direction_map[left_dir][1]
    if is_valid_cell(lx, ly, grid, visited):
        valid_moves.append((lx, ly, left_dir))

    # Right
    right_dir = right_turn[direction]
    rx, ry = x + direction_map[right_dir][0], y + direction_map[right_dir][1]
    if is_valid_cell(rx, ry, grid, visited):
        valid_moves.append((rx, ry, right_dir))

    return valid_moves


def is_valid_cell(x, y, grid, visited):
    return ((0 <= x < grid.shape[0]) and (0 <= y < grid.shape[1]) and
            (grid[x][y] == 0) and (x, y) not in visited)


def run_depth_algorithm(grid, start_position, number_of_moves):
    start_x, start_y = start_position
    start_direction = "E"

    # initialize dfs
    stack = [(start_x, start_y, start_direction, [(start_x, start_y)])]

    path_taken, time_taken, coverage, path_len = dfs(stack, grid)
    return path_taken, time_taken, coverage, path_len, number_of_moves
