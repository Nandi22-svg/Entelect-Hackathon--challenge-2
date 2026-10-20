const graph = {
  "A": [
    { node: "P1", time: 4, risk: 0 },
    { node: "P6", time: 5, risk: 2 }
  ],
  "B": [
    { node: "P5", time: 4, risk: 0 },
    { node: "P12", time: 4, risk: 0 }
  ],
  "S1": [
    { node: "P3", time: 4, risk: 0 },
    { node: "P4", time: 4, risk: 1 },
    { node: "P9", time: 5, risk: 1 }
  ],
  "S2": [
    { node: "P7", time: 4, risk: 0 },
    { node: "P8", time: 5, risk: 1 },
    { node: "P10", time: 5, risk: 2 }
  ],
  "S3": [
    { node: "P1", time: 4, risk: 0 },
    { node: "P2", time: 4, risk: 1 }
  ],
  "S4": [
    { node: "P4", time: 5, risk: 0 },
    { node: "P5", time: 4, risk: 0 },
    { node: "P10", time: 7, risk: 0 }
  ],
  "P1": [
    { node: "A", time: 4, risk: 0 },
    { node: "S3", time: 4, risk: 0 }
  ],
  "P2": [
    { node: "S3", time: 4, risk: 1 },
    { node: "P3", time: 3, risk: 0 }
  ],
  "P3": [
    { node: "P2", time: 3, risk: 0 },
    { node: "S1", time: 4, risk: 0 }
  ],
  "P4": [
    { node: "S1", time: 4, risk: 1 },
    { node: "S4", time: 5, risk: 0 }
  ],
  "P5": [
    { node: "S4", time: 4, risk: 0 },
    { node: "B", time: 4, risk: 0 }
  ],
  "P6": [
    { node: "A", time: 5, risk: 2 },
    { node: "P7", time: 4, risk: 0 }
  ],
  "P7": [
    { node: "P6", time: 4, risk: 0 },
    { node: "S2", time: 4, risk: 0 },
    { node: "P11", time: 4, risk: 2 }
  ],
  "P8": [
    { node: "S2", time: 5, risk: 1 },
    { node: "P9", time: 4, risk: 2 }
  ],
  "P9": [
    { node: "P8", time: 4, risk: 2 },
    { node: "S1", time: 5, risk: 1 }
  ],
  "P10": [
    { node: "S2", time: 5, risk: 2 },
    { node: "S4", time: 7, risk: 0 }
  ],
  "P11": [
    { node: "P7", time: 4, risk: 2 },
    { node: "P12", time: 5, risk: 1 }
  ],
  "P12": [
    { node: "P11", time: 5, risk: 1 },
    { node: "B", time: 4, risk: 0 }
  ]
};


function dijkstra(start, end) {

  const distances = {};
  const previous = {};
  const visited = new Set();

  for (let node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }

  distances[start] = 0;


  while (visited.size < Object.keys(graph).length) {

    let current = null;
    let smallest = Infinity;

    for (let node in distances) {
      if (!visited.has(node) && distances[node] < smallest) {
        smallest = distances[node];
        current = node;
      }
    }

    if (current === null) break;

    visited.add(current);


    for (let neighbour of graph[current]) {

      let cost = neighbour.time + neighbour.risk;

      let newDistance = distances[current] + cost;


      if (newDistance < distances[neighbour.node]) {
        distances[neighbour.node] = newDistance;
        previous[neighbour.node] = current;
      }
    }
  }


  let path = [];
  let current = end;

  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  return {
    path,
    cost: distances[end]
  };
}


// Try all possible station orders

function permutations(array) {

  if (array.length === 0) return [[]];

  let result = [];

  for (let i = 0; i < array.length; i++) {

    let current = array[i];

    let remaining = array.slice(0, i).concat(array.slice(i + 1));

    for (let perm of permutations(remaining)) {
      result.push([current, ...perm]);
    }
  }

  return result;
}


const stations = ["S1", "S2", "S3", "S4"];

let bestRoute = null;
let bestCost = Infinity;


for (let order of permutations(stations)) {

  let fullRoute = [];
  let totalCost = 0;

  let points = ["A", ...order, "B"];


  for (let i = 0; i < points.length - 1; i++) {

    let result = dijkstra(points[i], points[i + 1]);

    totalCost += result.cost;


    if (i === 0) {
      fullRoute.push(...result.path);
    } else {
      fullRoute.push(...result.path.slice(1));
    }
  }


  if (totalCost < bestCost) {
    bestCost = totalCost;
    bestRoute = fullRoute;
  }
}


console.log({
  route: bestRoute,
  cost: bestCost
});