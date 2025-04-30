import numpy as np
import heapq
import time

# Direction mappings
direction_map = {
    "N": (-1, 0),
    "S": (1, 0),
    "E": (0, 1),
    "W": (0, -1),
}

left_turn = {"N": "W", "W": "S", "S": "E", "E": "N"}
right_turn = {"N": "E", "E": "S", "S": "W", "W": "N"}

def is_valid_cell(x, y, grid, visited):
    return ((0 <= x < grid.shape[0]) and (0 <= y < grid.shape[1]) and
            (grid[x][y] == 0) and (x, y) not in visited)

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

def heuristic(scanned, total_cells):
    return (1 - len(scanned) / total_cells) * 100.0

def a_star_search(grid, start_position, number_of_moves):
    start_time = time.time()
    start_x, start_y = start_position
    start_direction = "E"
    total_cells = np.sum(grid == 0)

    visited = {}
    best_path = []
    best_coverage = 0.0
    best_path_len = 0
    best_scanned = set()

    pq = []
    initial_scanned = get_scan_area(start_x, start_y, start_direction, grid)
    heapq.heappush(pq, (heuristic(initial_scanned, total_cells), 0, start_x, start_y, start_direction,
                        [(start_x, start_y, start_direction)], initial_scanned))

    while pq:
        f_score, g_score, x, y, direction, path, scanned = heapq.heappop(pq)
        state = (x, y, direction)

        if state in visited and visited[state] <= g_score:
            continue
        visited[state] = g_score

        coverage = (len(scanned) / total_cells) * 100.0 if total_cells > 0 else 0.0

        if coverage > best_coverage or (coverage == best_coverage and len(path) < best_path_len):
            best_coverage = coverage
            best_path = path
            best_path_len = len(path)
            best_scanned = scanned

        if coverage >= 80.0 or g_score >= number_of_moves:
            continue

        valid_moves = get_valid_moves(x, y, direction, grid, {p[:2] for p in path})
        for nx, ny, ndir in valid_moves:
            new_scanned = scanned | get_scan_area(nx, ny, ndir, grid)
            new_path = path + [(nx, ny, ndir)]
            new_g = g_score + 1
            new_f = new_g + heuristic(new_scanned, total_cells)
            heapq.heappush(pq, (new_f, new_g, nx, ny, ndir, new_path, new_scanned))

    return best_path, (time.time() - start_time), best_coverage, best_path_len, number_of_moves

def run_astar_algorithm(grid, start_position, number_of_moves):
    """
    Wrapper to initialize and execute A* search with scanning and move limits.
    """
    return a_star_search(grid, start_position, number_of_moves)
