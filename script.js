// status variable decleration
let statusSorted = false;

const numberOfBarsInputEl = document.getElementById('number-of-bars');
const statusEl = document.getElementsByClassName('empathize');

// Create a random array of numbers
const creatRandomArray = (min, max) => {
  // Create the array
  const array = new Array(max - min + 1).fill(0).map((_, index) => min + index);
  // return the array in a random order
  return array.sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5);
};

// Create a bar chart
const createBarChart = data => {
  // Array Variables start and end
  const max = numberOfBarsInputEl.value;
  const min = 1;
  // computing the width of each bar
  const width = 100 / data.length;
  let html = '';
  // Check if the number of bars is greater than 500 to implement borders or not
  if (numberOfBarsInputEl.value > 500) {
    for (var i = 0; i < data.length; i++) {
      const percentage = ((data[i] - min) / (max - min)) * 100;
      html += `<div id="${data[i]}" class="bar" style="width:${width}%;height:${percentage}%"></div>`;
    }
  } else {
    for (var i = 0; i < data.length; i++) {
      const percentage = ((data[i] - min) / (max - min)) * 100;
      html += `<div id="${data[i]}" class="bar" style="width:${width}%;height:${percentage}%;border: 1px solid var(--primary);"></div>`;
    }
  }
  return html;
};

// Create variable for the sorting algorithms
const data = creatRandomArray(1, numberOfBarsInputEl.value);
let html = createBarChart(data);
const chartEl = document.getElementById('chart');
chartEl.innerHTML = html;

// Function to update the bars on the screen
const updateBarsPositions = sortedArray => {
  chartEl.innerHTML = ''; // Clear the chart

  const min = 1;
  const max = numberOfBarsInputEl.value;
  const width = 100 / sortedArray.length;

  sortedArray.forEach(value => {
    const percentage = ((value - min) / (max - min)) * 100;
    const bar = document.createElement('div');
    bar.id = value.toString();
    bar.className = 'bar';
    bar.style.width = `${width}%`;
    bar.style.height = `${percentage}%`;
    chartEl.appendChild(bar);
  });
};

const bubbleSort = (arr, i = 0, sorted = false) => {
  const length = arr.length;

  if (!sorted) {
    sorted = true;
    for (let j = 0; j < length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        sorted = false;
      }
    }
    updateBarsPositions(arr);
  }

  if (!sorted) {
    requestAnimationFrame(() => {
      bubbleSort(arr, i + 1);
    });
  }

  if (sorted) {
    isSorted(arr);
  }
};

const insertionSort = (arr, i = 1) => {
  const length = arr.length;

  if (i < length) {
    const current = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = current;
    updateBarsPositions(arr);

    requestAnimationFrame(() => {
      insertionSort(arr, i + 1);
    });
  } else {
    isSorted(arr);
  }
};

const quickSort = (arr, low = 0, high = arr.length - 1) => {
  const partition = (arr, low, high) => {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j <= high - 1; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
  };

  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    updateBarsPositions(arr);

    requestAnimationFrame(() => {
      quickSort(arr, low, pivotIndex - 1);
    });
    requestAnimationFrame(() => {
      quickSort(arr, pivotIndex + 1, high);
    });
  } else {
    isSorted(arr);
  }
};

const bucketSort = (arr, bucketSize = 5) => {
  const min = 1;
  const max = numberOfBarsInputEl.value;

  const bucketCount = Math.floor((max - min) / bucketSize) + 1;
  const buckets = new Array(bucketCount);

  for (let i = 0; i < bucketCount; i++) {
    buckets[i] = [];
  }

  arr.forEach(value => {
    const bucketIndex = Math.floor((value - min) / bucketSize);
    buckets[bucketIndex].push(value);
  });

  const sortedArray = [];

  const bubbleSort2 = (arr, i = 0, sorted = false) => {
    const length = arr.length;

    for (let i = 0; i < length - 1; i++) {
      let sorted = true;
      for (let j = 0; j < length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          sorted = false;
        }
      }
      if (sorted) {
        break; // Optimization: If no swaps are made, the array is already sorted
      }
    }
  };

  let currentBucketIndex = 0;

  const sortBuckets = () => {
    if (currentBucketIndex < buckets.length) {
      const currentBucket = buckets[currentBucketIndex];
      if (currentBucket.length > 0) {
        bubbleSort2(currentBucket); // Apply bubble sort to current bucket
        sortedArray.push(...currentBucket);
        updateBarsPositions(sortedArray);
      }
      currentBucketIndex++;
      requestAnimationFrame(sortBuckets);
    } else {
      isSorted(sortedArray);
    }
  };

  sortBuckets();
};

const shellSort = arr => {
  const length = arr.length;
  let gap = Math.floor(length / 2);

  const sortStep = () => {
    if (gap > 0) {
      for (let i = gap; i < length; i++) {
        const temp = arr[i];
        let j = i;

        while (j >= gap && arr[j - gap] > temp) {
          arr[j] = arr[j - gap];
          j -= gap;
        }

        arr[j] = temp;
      }

      gap = Math.floor(gap / 2);
      updateBarsPositions(arr);
      requestAnimationFrame(sortStep);
    } else {
      isSorted(arr);
    }
  };

  sortStep();
};

const mergeSort = arr => {
  const merge = (left, right) => {
    const merged = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] < right[rightIndex]) {
        merged.push(left[leftIndex]);
        leftIndex++;
      } else {
        merged.push(right[rightIndex]);
        rightIndex++;
      }
    }

    // Add remaining elements from the left array
    while (leftIndex < left.length) {
      merged.push(left[leftIndex]);
      leftIndex++;
    }

    // Add remaining elements from the right array
    while (rightIndex < right.length) {
      merged.push(right[rightIndex]);
      rightIndex++;
    }

    return merged;
  };

  const mergeSortRecursive = arr => {
    if (arr.length <= 1) {
      return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    const sortedLeft = mergeSortRecursive(left);
    const sortedRight = mergeSortRecursive(right);

    return merge(sortedLeft, sortedRight);
  };

  const sortedArray = mergeSortRecursive(arr);
  updateBarsPositions(sortedArray);
  isSorted(sortedArray);
};

const selectionSort = arr => {
  const length = arr.length;
  let currentIndex = 0;

  const selectionStep = () => {
    if (currentIndex < length - 1) {
      let minIndex = currentIndex;
      for (let i = currentIndex + 1; i < length; i++) {
        if (arr[i] < arr[minIndex]) {
          minIndex = i;
        }
      }

      if (minIndex !== currentIndex) {
        [arr[currentIndex], arr[minIndex]] = [arr[minIndex], arr[currentIndex]];
      }

      currentIndex++;
      updateBarsPositions(arr);
      requestAnimationFrame(selectionStep);
    } else {
      isSorted(arr);
    }
  };

  selectionStep();
};

const radixSort = arr => {
  const maxDigits = numberOfBarsInputEl.value.toString().length;

  const countSort = (arr, digit) => {
    const count = Array.from({length: 10}, () => []);

    arr.forEach(value => {
      const digitValue = Math.floor(value / digit) % 10;
      count[digitValue].push(value);
    });

    let sortedArray = [];
    for (let i = 0; i < count.length; i++) {
      sortedArray = sortedArray.concat(count[i]);
    }

    return sortedArray;
  };

  const radixSortStep = (arr, digit) => {
    if (digit >= maxDigits) {
      updateBarsPositions(arr);
      isSorted(arr);
      return;
    }

    const sortedArray = countSort(arr, Math.pow(10, digit));
    updateBarsPositions(sortedArray);

    requestAnimationFrame(() => {
      radixSortStep(sortedArray, digit + 1);
    });
  };

  radixSortStep(arr, 0);
};

const combSort = arr => {
  const length = arr.length;
  let gap = length;
  let swapped = true;

  const getNextGap = currentGap => {
    // Shrink gap by a factor of 1.3
    currentGap = Math.floor(currentGap / 1.3);
    if (currentGap < 1) {
      return 1;
    }
    return currentGap;
  };

  const combSortStep = () => {
    if (gap === 1 && !swapped) {
      // Sorting completed
      return;
    } else {
      isSorted(arr);
    }

    // Update the gap for the next iteration
    gap = getNextGap(gap);

    swapped = false;

    for (let i = 0; i < length - gap; i++) {
      if (arr[i] > arr[i + gap]) {
        [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
        swapped = true;
      }
    }

    updateBarsPositions(arr);

    requestAnimationFrame(combSortStep);
  };

  combSortStep();
};

const isSorted = arr => {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1] > arr[i]) {
      statusSorted = false;
      break;
    } else {
      statusSorted = true;
      statusEl[0].innerText = 'sorted';
    }
  }
};

// all btn

document.querySelector('.button-container').addEventListener('click', e => {
  if (e.target.className === 'btn') {
    const sortingAlgorithm = e.target.id + 'Sort';
    const barsEl = Array.from(document.querySelectorAll('.bar'));
    const bars = barsEl.map(bar => parseInt(bar.id));
    eval(sortingAlgorithm)(bars);
  }
});

// reset btn
document.getElementById('create').addEventListener('click', () => {
  const data = creatRandomArray(1, numberOfBarsInputEl.value);
  let html = createBarChart(data);
  chartEl.innerHTML = html;
  statusSorted = false;
  statusEl[0].innerText = 'unsorted';
});
