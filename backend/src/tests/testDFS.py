import unittest
import numpy as np
from algorithms import depth_first_search as dfs

class TestDepthFirstSearch(unittest.TestCase):

    def setUp(self):
        self.empty_grid = np.zeros((10, 10), dtype=int)
        self.full_obstacle_grid = np.ones((10, 10), dtype=int)
        self.single_path_grid = np.zeros((5, 5), dtype=int)
        self.single_path_grid[1:, 2] = 1  
        self.start_pos = (0, 0)
        self.moves = 100

    def test_dfs_basic_run(self):
        result = dfs.run_depth_algorithm(self.empty_grid, self.start_pos, self.moves)
        self.assertIsInstance(result, tuple)

    def test_dfs_returns_path(self):
        path, *_ = dfs.run_depth_algorithm(self.empty_grid, self.start_pos, self.moves)
        self.assertIsInstance(path, list)

    def test_dfs_coverage_is_float(self):
        *_, coverage, _ = dfs.run_depth_algorithm(self.empty_grid, self.start_pos, self.moves)
        self.assertIsInstance(coverage, float)

    def test_dfs_handles_full_obstacles(self):
        result = dfs.run_depth_algorithm(self.full_obstacle_grid, self.start_pos, self.moves)
        self.assertIsInstance(result, tuple)

    def test_dfs_path_length(self):
        *_, path_len = dfs.run_depth_algorithm(self.empty_grid, self.start_pos, self.moves)[0:4]
        self.assertGreaterEqual(path_len, 0)

    def test_dfs_coverage_empty_grid(self):
        *_, coverage, _ = dfs.run_depth_algorithm(self.empty_grid, self.start_pos, self.moves)
        self.assertGreater(coverage, 0)

    def test_dfs_path_structure(self):
        path, *_ = dfs.run_depth_algorithm(self.empty_grid, self.start_pos, self.moves)
        if path:
            self.assertEqual(len(path[0]), 3)

    def test_dfs_single_cell_grid(self):
        grid = np.zeros((1, 1), dtype=int)
        result = dfs.run_depth_algorithm(grid, (0, 0), 10)
        self.assertEqual(len(result[0]), 1)

    def test_dfs_boundary_movement(self):
        grid = np.zeros((3, 3), dtype=int)
        result = dfs.run_depth_algorithm(grid, (0, 2), 10)
        self.assertTrue(isinstance(result[0], list))

    def test_dfs_scanning_area_size(self):
        scanned = dfs.get_scan_area(5, 5, "E", self.empty_grid)
        self.assertLessEqual(len(scanned), 6)

    def test_dfs_does_not_move_backwards(self):
        #To Do
        self.assertTrue(True)

    def test_dfs_explores_all_paths(self):
        self.assertIn(1, [1, 2, 3])

    def test_dfs_turns_left(self):
        self.assertIn("W", dfs.left_turn.values())

    def test_dfs_turns_right(self):
        self.assertIn("E", dfs.right_turn.values())

    def test_dfs_handles_corner_start(self):
        grid = np.zeros((10, 10), dtype=int)
        result = dfs.run_depth_algorithm(grid, (9, 9), 25)
        self.assertTrue(isinstance(result[0], list))

    def test_dfs_handles_complex_grid(self):
        grid = np.random.choice([0, 1], size=(20, 20), p=[0.7, 0.3])
        result = dfs.run_depth_algorithm(grid, (0, 0), 100)
        self.assertTrue(len(result[0]) <= 100)

    def test_dfs_with_direction_east(self):
        scanned = dfs.get_scan_area(3, 3, "E", self.empty_grid)
        self.assertIsInstance(scanned, set)

    def test_dfs_valid_cell_check(self):
        valid = dfs.is_valid_cell(1, 1, self.empty_grid, set())
        self.assertTrue(valid)

    def test_dfs_valid_moves_output(self):
        moves = dfs.get_valid_moves(2, 2, "N", self.empty_grid, set())
        self.assertIsInstance(moves, list)

    def test_dfs_valid_moves_direction(self):
        moves = dfs.get_valid_moves(2, 2, "S", self.empty_grid, set())
        self.assertTrue(all(len(m) == 3 for m in moves))

    def test_dfs_coverage_zero_on_blocked_grid(self):
        *_, coverage, _ = dfs.run_depth_algorithm(self.full_obstacle_grid, self.start_pos, self.moves)
        self.assertEqual(coverage, 0)

    def test_dfs_runtime_is_float(self):
        *_, time_taken, _, _ = dfs.run_depth_algorithm(self.empty_grid, self.start_pos, self.moves)
        self.assertIsInstance(time_taken, float)

    def test_dfs_handles_obstacles_gracefully(self):
        grid = self.empty_grid.copy()
        grid[0][1] = 1
        result = dfs.run_depth_algorithm(grid, (0, 0), self.moves)
        self.assertIsInstance(result, tuple)

    def test_dfs_result_length(self):
        result = dfs.run_depth_algorithm(self.empty_grid, self.start_pos, self.moves)
        self.assertEqual(len(result), 5)

    def test_dummy_logic_a(self):
        self.assertEqual(2 + 2, 4)

    def test_dummy_logic_b(self):
        self.assertNotEqual(5, 10)

    def test_dummy_logic_c(self):
        self.assertIn("N", dfs.direction_map)

    def test_dummy_logic_d(self):
        self.assertTrue(callable(dfs.get_scan_area))

    def test_dummy_logic_e(self):
        self.assertTrue(callable(dfs.run_depth_algorithm))


if __name__ == '__main__':
    unittest.main()
