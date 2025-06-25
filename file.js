function minTimeToVisitAllPoints(points) {
  let totalTime = 0;

  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i - 1];
    const [x2, y2] = points[i];
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    totalTime += Math.max(dx, dy);
  }

  return totalTime;
}


const points1 = [[1,1],[3,4],[-1,0]];
console.log(minTimeToVisitAllPoints(points1)); 

const points2 = [[3,2],[-2,2]];
console.log(minTimeToVisitAllPoints(points2)); 
