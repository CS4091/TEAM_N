class Grid:
    def __init__(self, width, height, obstacles=None):
        self.width = width
        self.height = height
        self.grid = [[0 for _ in range(width)] for _ in range(height)]

        # Place obstacles
        if obstacles:
            for x, y in obstacles:
                self.grid[y][x] = '#'  # Mark obstacle position

    def is_valid_move(self, x, y):
        """Checks if a move is within bounds and not an obstacle."""
        return 0 <= x < self.width and 0 <= y < self.height and self.grid[y][x] != 1

    def mark_scanned(self, x, y):
        """Marks a cell as scanned."""
        if self.is_valid_move(x, y):
            self.grid[y][x] = 'S'

    def display(self):
        """Prints the grid to visualize it."""
        for row in self.grid:
            print(" ".join(str(cell) for cell in row))

class Aircraft:
    # Directions: Down, Right, Up, Left (clockwise)
    DIRECTIONS = [(0, 1), (1, 0), (0, -1), (-1, 0)]  

    def __init__(self, x, y, direction=0):
        self.x = x
        self.y = y
        self.direction = direction  # 0: Down, 1: Right, 2: Up, 3: Left

    def move_forward(self, grid):
        """Moves forward if within bounds and not blocked."""
        dx, dy = self.DIRECTIONS[self.direction]
        new_x, new_y = self.x + dx, self.y + dy

        if grid.is_valid_move(new_x, new_y):
            self.x, self.y = new_x, new_y
            return True
        return False
    
    def turn_left(self):
        """Rotates counterclockwise."""
        self.direction = (self.direction - 1) % 4

    def turn_right(self):
        """Rotates clockwise."""
        self.direction = (self.direction + 1) % 4