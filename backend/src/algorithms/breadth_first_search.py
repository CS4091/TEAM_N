import numpy as np
import time
from collections import deque
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

def bfs(queue, grid):
    """
    Iterative BFS to explore the grid while maximizing scan coverage.

    :param queue: deque - (x, y, direction, path)
    :param grid: np.array - represents the grid
    :return: Full path taken and time taken
    """

    start_time = time.time()

    visited = set()
    scanned = set()
    path = []

    while queue:
        x, y, direction, path = queue.popleft()

        # Mark as visited
        if (x, y) in visited:
            continue
        visited.add((x, y))

        # Scan a 2x3 area in front of the aircraft
        scan_area = get_scan_area(x, y, direction, grid)
        scanned.update(scan_area)

        # Get next valid moves (forward, left, right)
        next_moves = get_valid_moves(x, y, direction, grid, visited)
        for next_x, next_y, next_dir in next_moves:
                queue.append((next_x, next_y, next_dir, path + [(next_x, next_y, next_dir)]))

    ''' Calculate Metrics '''
    # get percentage of grid covered
    scanned_cells = len(scanned)
    total_cells = np.sum(grid == 0)
    coverage = (scanned_cells / total_cells) * 100.0 if total_cells > 0 else 0.0

    path_len = len(path)

    return path, (time.time() - start_time), coverage, path_len


def get_scan_area(x, y, direction, grid):
    """ Scans a 2x3 area in front of the aircraft """

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
    """ Returns valid moves: forward, left, right (NO BACKWARDS movement) """

    valid_moves = []
    dx, dy = direction_map[direction]

    # Move forward
    fx, fy = x + dx, y + dy
    if is_valid_cell(fx, fy, grid, visited):
        valid_moves.append((fx, fy, direction))

    # Left turn
    left_dir = left_turn[direction]
    lx, ly = x + direction_map[left_dir][0], y + direction_map[left_dir][1]
    if 0 <= lx < grid.shape[0] and 0 <= ly < grid.shape[1]:
        if is_valid_cell(lx, ly, grid, visited):
            valid_moves.append((lx, ly, left_dir))

    # Right turn
    right_dir = right_turn[direction]
    rx, ry = x + direction_map[right_dir][0], y + direction_map[right_dir][1]
    if 0 <= rx < grid.shape[0] and 0 <= ry < grid.shape[1]:
        if is_valid_cell(rx, ry, grid, visited):
            valid_moves.append((rx, ry, right_dir))

    return valid_moves


def is_valid_cell(x, y, grid, visited):
    """ Checks if a cell is within bounds, not an obstacle, and not visited """
    return ((0 <= x < grid.shape[0]) and (0 <= y < grid.shape[1]) and
            (grid[x][y] == 0) and (x, y) not in visited)


''' Main Start '''
def run_breadth_algorithm(grid, start_position, number_of_moves):
    # Load grid and starting positions
    grid = grid
    start_x, start_y = start_position
    start_direction = "E"

    # initialize bfs
    queue = deque([(start_x, start_y, start_direction, [(start_x, start_y)])])

    # run bfs until all reachable cells are visited
    path_taken, time_taken, coverage, path_len = bfs(queue, grid)

    return path_taken, time_taken, coverage, path_len, number_of_moves
