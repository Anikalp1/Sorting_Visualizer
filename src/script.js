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

let moves = bubbbleSort(array);

animate();

function bubbbleSort(array) {
  const moves = [];
  do {
    var swapped = false;
    for (let i = 1; i < array.length; i++) {
      if (array[i - 1] > array[i]) {
        swapped = true;
        [array[i - 1], array[i]] = [array[i], array[i - 1]];
        moves.push({ indices: [i - 1, i], swap: true });
      } else {
        moves.push({ indices: [i - 1 - i], swap: false });
      }
    }
  } while (swapped);
  return moves;
}
function animate() {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  let changed = false;
  for (let i = 0; i < cols.length; i++) {
    changed = cols[i].draw(ctx) || changed;
  }

  if(!changed && moves.length>0)
    {
        const move = moves.shift();
        const [i, j] = move.indices;
        if(move.swap)
            {
                cols[i].moveTo(cols[j]);
                cols[j].moveTo(cols[i], -1);
                [cols[i], cols[j]] = [cols[j], cols[i]];
            }
        else
        {
            //to-do
        }
    }
  requestAnimationFrame(animate);
}
