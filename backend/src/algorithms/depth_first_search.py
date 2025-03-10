from classes import Grid, Aircraft


def depth_first_search(grid, aircraft, visited=None):
    if visited is None:
        visited = set()
    
    x, y = aircraft.x, aircraft.y
    if (x, y) in visited:
        return False  # Already visited this cell

    visited.add((x, y))
    grid.mark_scanned(x, y)  # Mark the current cell as scanned

    # Try moving forward
    if aircraft.move_forward(grid):
        depth_first_search(grid, aircraft, visited)
        # Move back (undo movement)
        aircraft.turn_left()
        aircraft.turn_left()
        aircraft.move_forward(grid)  # Moves back to the original position
        aircraft.turn_left()
        aircraft.turn_left()

    # Try turning left
    aircraft.turn_left()
    depth_first_search(grid, aircraft, visited)
    aircraft.turn_right()  # Undo turn

    # Try turning right
    aircraft.turn_right()
    aircraft.turn_right()
    depth_first_search(grid, aircraft, visited)
    aircraft.turn_left()  # Undo turn

    return True