import os
from flask import Flask, jsonify, send_from_directory
from grid_generation.grid_world_search_generator import generate_map

# Global variables to store the generated map data
grid = None
start_position = None
number_of_moves = None

def initialize_map():
    """Generate the map once when the server starts."""
    global grid, start_position, number_of_moves
    grid, start_position, number_of_moves = generate_map()

initialize_map()

# Create the Flask app; 'build' will be the folder with the bundled React app.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
index_path = os.path.join(BASE_DIR, '../../client/build')
app = Flask(__name__, static_folder=index_path)

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

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # serve build folder index.html
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    # serve index.html
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    # Running locally on port 5000 in debug mode.
    app.run(debug=True)