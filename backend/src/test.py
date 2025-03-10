from classes import Grid, Aircraft
from algorithms.depth_first_search import depth_first_search

if __name__ == "__main__":
  # Initialize grid and aircraft
  obstacles = [(2, 2), (3, 3), (1, 4)]
  grid = Grid(5, 5, obstacles)
  aircraft = Aircraft(0, 0)
  grid.display()

  # Example movements
  '''
  aircraft.move_forward(grid)
  aircraft.turn_right()
  aircraft.move_forward(grid)
  aircraft.turn_left()
  aircraft.move_forward(grid)

  # Mark scanned positions
  grid.mark_scanned(aircraft.x, aircraft.y)
  
  # Display the grid
  grid.display()'
  '''

  #Test DFS
  depth_first_search(grid, aircraft)

  print("\nFinal Grid After DFS:")
  grid.display()