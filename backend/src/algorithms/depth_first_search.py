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

def dfs(stack, grid, number_of_moves):
    """
    Iterative DFS to explore the grid while maximizing scan coverage,
    within a move limit and targeting at least 80% scan coverage.
    """
    start_time = time.time()

    visited = set()
    best_path = []
    best_coverage = 0.0
    best_path_len = 0
    best_scanned = set()

    total_cells = np.sum(grid == 0)

    while stack:
        x, y, direction, path, scanned = stack.pop()

        if (x, y, direction) in visited:
            continue
        visited.add((x, y, direction))

        # Scan area from current position
        new_scanned = scanned | get_scan_area(x, y, direction, grid)
        coverage = (len(new_scanned) / total_cells) * 100.0 if total_cells > 0 else 0.0

        if coverage > best_coverage or (coverage == best_coverage and len(path) < best_path_len):
            best_coverage = coverage
            best_path = path
            best_path_len = len(path)
            best_scanned = new_scanned

        # Enforce max moves
        if len(path) >= number_of_moves:
            continue

        # Early exit if coverage goal met
        if coverage >= 80.0:
            break

        # Get valid next moves
        next_moves = get_valid_moves(x, y, direction, grid, {p[:2] for p in path})
        for next_x, next_y, next_dir in next_moves:
            stack.append((
                next_x,
                next_y,
                next_dir,
                path + [(next_x, next_y, next_dir)],
                new_scanned
            ))

    return best_path, (time.time() - start_time), best_coverage, best_path_len


def get_scan_area(x, y, direction, grid):
    """
    Computes the 2x3 rectangular area in front of the aircraft based on its direction.

    :param x: int - Current x-coordinate (row)
    :param y: int - Current y-coordinate (column)
    :param direction: str - Current heading ('N', 'S', 'E', 'W')
    :param grid: np.array - Grid representing the map
    :return: set - Set of tuples representing the scanned cells
    """
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
    """
    Generates a list of valid next positions the aircraft can move to.
    Aircraft can move forward, turn left, or turn right (but not backward).
    Each movement also updates the direction accordingly.

    :param x: int - Current x-coordinate
    :param y: int - Current y-coordinate
    :param direction: str - Current heading
    :param grid: np.array - Grid map
    :param visited: set - Set of already visited coordinates
    :return: list - List of tuples representing valid (x, y, direction) moves
    """
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
    """
    Checks whether a cell is a valid location for the aircraft to move into.
    A valid cell is within bounds, not an obstacle, and has not been visited yet.

    :param x: int - Row index
    :param y: int - Column index
    :param grid: np.array - Grid map
    :param visited: set - Set of already visited positions
    :return: bool - True if the cell is valid, False otherwise
    """
    return ((0 <= x < grid.shape[0]) and (0 <= y < grid.shape[1]) and
            (grid[x][y] == 0) and (x, y) not in visited)


def run_depth_algorithm(grid, start_position, number_of_moves):
    """
    Wrapper to initialize and execute DFS search with scanning and move limits.
    """
    start_x, start_y = start_position
    start_direction = "E"

    initial_stack = [(
        start_x,
        start_y,
        start_direction,
        [(start_x, start_y, start_direction)],
        set()
    )]

    path_taken, time_taken, coverage, path_len = dfs(initial_stack, grid, number_of_moves)
    return path_taken, time_taken, coverage, path_len, number_of_moves
