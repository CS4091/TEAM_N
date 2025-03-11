# Air-to-Ground Search Project

## Overview
The **Air-to-Ground Search Project** will implement and compare several path planning algorithms to determine the most efficient flight paths for aircraft operating in a 2D grid world. The algorithms aim to maximize grid coverage while minimizing movements, adhering to constraints such as fixed movement patterns (forward, left, right) and navigating around static obstacles.

## Team N
- **Jack Madison**
- **Debora Andrade**
- **Makalyn Kline**
- **Jordan Lewis**
- **Garrett Wacker**
- **Jakob Ferguson**

## Tech Stack
- **Front-End:** React.js
- **Back-End:** Python

## Installation

### Prerequisites
- [Node.js v22.14.0](https://nodejs.org/en/)
- [Python3](https://www.python.org/)
### Use node and Python to install the dependencies
```bash
cd "$(git rev-parse --show-toplevel)"; cd client; npm install; cd "$(git rev-parse --show-toplevel)"; cd backend; pip install Flask;
```

## Starting the App
```bash
cd "$(git rev-parse --show-toplevel)"; cd client; npm run build; python ../backend/src/main.py; cd "$(git rev-parse --show-toplevel)"; cd client; npm start
```

