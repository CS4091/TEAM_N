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

def bfs(queue, visited, grid, scanned, total_cells, steps_cache):
    """
    Iterative BFS to explore the grid while maximizing scan coverage.

    :param queue: deque - (x, y, direction, path)
    :param visited: set - tracks cells the aircraft has visited
    :param grid: np.array - represents the grid
    :param scanned: set - tracks cells the aircraft has scanned
    :param total_cells: int - total clear cells
    :param steps_cache: list - keeps track of the path for visualization
    :return: Full path taken and time taken
    """

    start_time = time.time()

    while queue:
        x, y, direction, path = queue.popleft()

        # Mark as visited
        visited.add((x, y))

        # Scan a 2x3 area in front of the aircraft
        scan_area = get_scan_area(x, y, direction, grid)
        scanned.update(scan_area)

        # Store step for visualization
        steps_cache.append((x, y, direction, path))

        # Get next valid moves (forward, left, right)
        next_moves = get_valid_moves(x, y, direction, grid, visited)
        for next_x, next_y, next_dir in next_moves:
            if (next_x, next_y) not in visited:
                queue.append((next_x, next_y, next_dir, path + [(next_x, next_y)]))

    return path, time.time() - start_time


def get_scan_area(x, y, direction, grid):
    """ Scans a 2x3 area in front of the aircraft """

    scanned_cells = set()
    dx, dy = direction_map[direction]

    for i in range(1, 3):  # Look 2 cells ahead
        for j in [-1, 0, 1]:  # Width of 3 cells
            scanned_x, scanned_y = x + dx * i, y + dy * i + j
            if 0 <= scanned_x < grid.shape[0] and 0 <= scanned_y < grid.shape[1]:
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
    if is_valid_cell(lx, ly, grid, visited):
        valid_moves.append((lx, ly, left_dir))

    # Right turn
    right_dir = right_turn[direction]
    rx, ry = x + direction_map[right_dir][0], y + direction_map[right_dir][1]
    if is_valid_cell(rx, ry, grid, visited):
        valid_moves.append((rx, ry, right_dir))

    return valid_moves


def is_valid_cell(x, y, grid, visited):
    """ Checks if a cell is within bounds, not an obstacle, and not visited """
    return grid.shape[0] > x >= 0 == grid[x][y] and 0 <= y < grid.shape[1] and (x, y) not in visited


''' Main Start '''
def run_breadth_algorithm(grid, start_position, number_of_moves):
    # Load grid and starting positions
    grid = grid
    start_x, start_y = start_position
    start_direction = "N"

    # initialize bfs
    queue = deque([(start_x, start_y, start_direction, [(start_x, start_y)])])
    visited = set()
    scanned = set()
    steps_cache = []
    total_cells = np.sum(grid == 0)

    # run bfs until all reachable cells are visited
    path_taken, time_taken = bfs(queue, visited, grid, scanned, total_cells, steps_cache)

    ''' Calculate Metrics '''
    number_of_moves = len(steps_cache)

    # get percentage of grid covered
    scanned_cells = len(scanned)
    coverage = (scanned_cells / total_cells) * 100.0
    return steps_cache, time_taken, coverage
