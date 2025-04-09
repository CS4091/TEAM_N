import os
from flask import Flask, jsonify, send_from_directory, request
from grid_generation.grid_world_search_generator import generate_map
from algorithms.breadth_first_search import run_breadth_algorithm
from algorithms.depth_first_search import run_depth_algorithm
from flask_cors import CORS
from datetime import datetime
import json

# Global variables to store the generated map data
grid = None
start_position = None
number_of_moves = None

def initialize_map():
    """Generate the map once when the server starts."""
    global grid, start_position, number_of_moves
    grid, start_position, number_of_moves = generate_map()
    print("Map generated")
    print(number_of_moves)

initialize_map()

# Create the Flask app; 'build' will be the folder with the bundled React app.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
index_path = os.path.join(BASE_DIR, '../../client/build')
app = Flask(__name__, static_folder=index_path)
CORS(app)

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify(message="Hello from Flask!")

@app.route('/api/get-map', methods=['GET'])
def get_map():
    """Returns the pre-generated grid and associated data."""
    response_data = {
        "grid": grid.tolist(),  # Convert NumPy array to list for JSON serialization
        "start_position": start_position,
        "number_of_moves": number_of_moves
    }
    return jsonify(response_data)

@app.route('/api/save-path', methods=['POST'])
def save_path():
    data = request.json
    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    save_dir = os.path.join(BASE_DIR, "saved_runs")
    os.makedirs(save_dir, exist_ok=True)
    filename = os.path.join(save_dir, f"path_{timestamp}.json")

    with open(filename, 'w') as f:
        json.dump(data, f, indent=4)

    return jsonify({"status": "success", "filename": filename})


@app.route('/api/breadth', methods=['GET'])
def breadth():
    path, time_taken, coverage, path_len, num_moves = run_breadth_algorithm(grid, start_position, number_of_moves)
    print(path)
    return jsonify({
        "path": path,
        "time": time_taken,
        "coverage": coverage,
        "path_len": path_len,
        "number_of_moves": num_moves,
        "status": "done"
    })

@app.route('/api/depth', methods=['GET'])
def depth():
    path, time_taken, coverage, path_len, num_moves = run_depth_algorithm(grid, start_position, number_of_moves)
    print(path)
    return jsonify({
        "path": path,
        "time": time_taken,
        "coverage": coverage,
        "path_len": path_len,
        "number_of_moves": num_moves,
        "status": "done"
    })

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # Serve files from React build directory
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
