myCanvas.width = 400;
myCanvas.height = 300;

const margin = 30;
const n = 20;
const array = [];

for (let i = 0; i < n; i++) {
  array[i] = Math.random();
}

const cols = [];
const spacing = (myCanvas.width - margin * 2) / n;
const ctx = myCanvas.getContext("2d");

const maxColumnHeight = 200;

for (let i = 0; i < array.length; i++) {
  const x = i * spacing + spacing / 2 + margin;
  const y = myCanvas.height - margin - i * 3;
  const width = spacing - 4;
  const height = maxColumnHeight * array[i];

  cols[i] = new Column(x, y, width, height);
}

animate();

function animate() {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  for (let i = 0; i < cols.length; i++) {
    cols[i].draw(ctx);
  }

  requestAnimationFrame(animate);
}
