import os
from flask import Flask, jsonify, send_from_directory

# Create the Flask app; 'build' will be the folder with the bundled React app.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
index_path = os.path.join(BASE_DIR, '../../client/build')
app = Flask(__name__, static_folder=index_path)

@app.route('/api/hello')
def hello():
    return jsonify(message="Hello from Flask!")


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