myCanvas.width = 500;
myCanvas.height = 400;
const margin = 30;
const n = 30;
const array = [];
let moves = [];
const cols = [];
const spacing = (myCanvas.width - margin * 2) / n;
const ctx = myCanvas.getContext("2d");

const maxColumnHeight = 200;

init();

let audioCtx = null;

function playNote(freq, type) {
  if (audioCtx == null) {
    audioCtx = new (AudioContext ||
      webkitAudioContext ||
      window.webkitAudioContext)();
  }
  const dur = 0.2;
  const osc = audioCtx.createOscillator();
  osc.frequency.value = freq;
  osc.start();
  osc.type = type;
  osc.stop(audioCtx.currentTime + dur);

  const node = audioCtx.createGain();
  node.gain.value = 0.4;
  node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
  osc.connect(node);
  node.connect(audioCtx.destination);
}

function init() {
  for (let i = 0; i < n; i++) {
    array[i] = Math.random();
  }
  moves = [];
  for (let i = 0; i < array.length; i++) {
    const x = i * spacing + spacing / 2 + margin;
    const y = myCanvas.height - margin - i * 3;
    const width = spacing - 4;
    const height = maxColumnHeight * array[i];
    cols[i] = new Column(x, y, width, height);
  }
}

function play() {
  const algorithm = document.getElementById("algorithm").value;
  if (algorithm === "bubble") {
    moves = bubbleSort(array);
  } else if (algorithm === "insertion") {
    moves = insertionSort(array);
  } else if (algorithm === "selection") {
    moves = selectionSort(array);
  } else if (algorithm === "quick") {
    moves = quickSort(array);
  } else if (algorithm === "heap") {
    moves = heapSort(array);
  }
}

animate();

function bubbleSort(array) {
  const moves = [];
  do {
    var swapped = false;
    for (let i = 1; i < array.length; i++) {
      if (array[i - 1] > array[i]) {
        swapped = true;
        [array[i - 1], array[i]] = [array[i], array[i - 1]];
        moves.push({ indices: [i - 1, i], swap: true });
      } else {
        moves.push({ indices: [i - 1, i], swap: false });
      }
    }
  } while (swapped);
  return moves;
}

function insertionSort(array) {
  const moves = [];
  for (let i = 1; i < array.length; i++) {
    let j = i;
    while (j > 0 && array[j - 1] > array[j]) {
      [array[j - 1], array[j]] = [array[j], array[j - 1]];
      moves.push({ indices: [j - 1, j], swap: true });
      j--;
    }
  }
  return moves;
}

function selectionSort(array) {
  const moves = [];
  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
      moves.push({ indices: [i, j], swap: false });
    }
    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      moves.push({ indices: [i, minIndex], swap: true });
    }
  }
  return moves;
}

function quickSort(array) {
  const moves = [];
  quickSortHelper(array, 0, array.length - 1, moves);
  return moves;
}

function quickSortHelper(array, start, end, moves) {
  if (start < end) {
    const pivotIndex = partition(array, start, end, moves);
    quickSortHelper(array, start, pivotIndex - 1, moves);
    quickSortHelper(array, pivotIndex + 1, end, moves);
  }
}

function partition(array, start, end, moves) {
  const pivotValue = array[end];
  let pivotIndex = start;

  for (let i = start; i < end; i++) {
    if (array[i] < pivotValue) {
      if (i !== pivotIndex) {
        [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
        moves.push({ indices: [i, pivotIndex], swap: true });
      } else {
        moves.push({ indices: [i, pivotIndex], swap: false });
      }
      pivotIndex++;
    } else {
      moves.push({ indices: [i, pivotIndex], swap: false });
    }
  }

  if (pivotIndex !== end) {
    [array[pivotIndex], array[end]] = [array[end], array[pivotIndex]];
    moves.push({ indices: [pivotIndex, end], swap: true });
  } else {
    moves.push({ indices: [pivotIndex, end], swap: false });
  }

  return pivotIndex;
}

function heapSort(array) {
  const moves = [];
  buildMaxHeap(array, moves);

  for (let end = array.length - 1; end > 0; end--) {
    // Swap the root of the heap with the last element
    [array[0], array[end]] = [array[end], array[0]];
    moves.push({ indices: [0, end], swap: true });

    // Re-heapify the reduced heap
    siftDown(array, 0, end - 1, moves);
  }

  return moves;
}

function buildMaxHeap(array, moves) {
  const start = Math.floor(array.length / 2) - 1;

  for (let i = start; i >= 0; i--) {
    siftDown(array, i, array.length - 1, moves);
  }
}

function siftDown(array, start, end, moves) {
  let root = start;

  while (root * 2 + 1 <= end) {
    let child = root * 2 + 1;
    let swap = root;

    if (array[swap] < array[child]) {
      swap = child;
    }

    if (child + 1 <= end && array[swap] < array[child + 1]) {
      swap = child + 1;
    }

    if (swap === root) {
      moves.push({ indices: [root, child], swap: false });
      return;
    } else {
      [array[root], array[swap]] = [array[swap], array[root]];
      moves.push({ indices: [root, swap], swap: true });
      root = swap;
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  let changed = false;
  for (let i = 0; i < cols.length; i++) {
    changed = cols[i].draw(ctx) || changed;
  }

  if (!changed && moves.length > 0) {
    const move = moves.shift();
    const [i, j] = move.indices;
    const waveformType = move.swap ? "square" : "sine";
    playNote(cols[i].height + cols[j].height, waveformType);
    if (move.swap) {
      cols[i].moveTo(cols[j]);
      cols[j].moveTo(cols[i], -1);
      [cols[i], cols[j]] = [cols[j], cols[i]];
    } else {
      cols[i].jump();
      cols[j].jump();
    }
  }

  requestAnimationFrame(animate);
}
