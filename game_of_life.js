// Browser-compatible version - load data asynchronously
let data = [];

async function loadData() {
    try {
        const response = await fetch('./data_50_k.json');
        data = await response.json();
        console.log('Data loaded:', data.length, 'items');
        runAnalysis();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

const test_arr = [8, 3, 6, 1, 5, 2, 4, 9, 7, 8]

function mean(arr) {
    let sum = 0
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i]
    }
    return sum / arr.length
}

function bubbleSort(arr) {
    for (var j=0; j<arr.length; j++) {
        var change = false
        for (var i=0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i+1]) {
                var temp = arr[i]
                arr[i] = arr[i+1]
                arr[i+1] = temp
                change = true
            } 
        }
        if (!change) {
            break
        }
    }
    return arr
}

// Fast Quicksort implementation
function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = [];
    const right = [];
    const equal = [];
    
    for (let element of arr) {
        if (element < pivot) {
            left.push(element);
        } else if (element > pivot) {
            right.push(element);
        } else {
            equal.push(element);
        }
    }
    
    return [...quickSort(left), ...equal, ...quickSort(right)];
}

// Even faster: use JavaScript's built-in Timsort (hybrid of merge sort and insertion sort)
function fastSort(arr) {
    return arr.slice().sort((a, b) => a - b);
}

// var sorted_test = bubbleSort(test_arr)

function median(sorted_arr) {
    if (sorted_arr.length % 2 == 0) {
        return (sorted_arr[sorted_arr.length / 2] + sorted_arr[(sorted_arr.length / 2) - 1]) / 2
    }
    return sorted_arr[(sorted_arr.length / 2) - 0.5]
}

function minimum(sorted_arr) {
    return sorted_arr[0]
}

function maximum(sorted_arr) {
    return sorted_arr[sorted_arr.length - 1]
}

function range(sorted_arr) {
    return maximum(sorted_arr) - minimum(sorted_arr)
}

function variance(arr) {
    var arr_mean = mean(arr)
    var sum = 0
    for (var i=0; i<arr.length; i++) {
        sum += (arr[i] - arr_mean)**2
    }
    return sum / arr.length
}

function std(arr) {
    return Math.sqrt(variance(arr))
}

function skewness(arr) {
    // return 3*(mean(sorted_arr) - median(sorted_arr)) / std(sorted_arr)
    let sum = 0
    let arr_mean = mean(arr)
    for (var i = 0; i < arr.length; i++) {
        sum += (arr[i] - arr_mean)**3
    }
    return sum / (arr.length * std(arr)**3)
}

function kurtosis(arr) {
    let sum = 0
    let arr_mean = mean(arr)
    for (var i = 0; i < arr.length; i++) {
        sum += (arr[i] - arr_mean)**4
    }
    return sum / (arr.length * std(arr)**4)
}

// Excess kurtosis (more commonly used - subtracts 3)
function excessKurtosis(arr) {
    return kurtosis(arr) - 3;
}

function mode(arr) {
    let counts = {}
    let maxKey
    let max = -Infinity
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] in counts) {
            counts[arr[i]] += 1
        }
        else {
            counts[arr[i]] = 1
        }
    }

    for (const key in counts) {
        const value = counts[key]
        if (value > max) {
            max = value;
            maxKey = key;
        }
    }
    return [maxKey, max, Object.keys(counts).length]
}

function percentile_25(arr_sorted) {
    let quart = (arr_sorted.length / 4) - 1 
    return arr_sorted[quart]
}

function percentile_75(arr_sorted) {
    let quart = (arr_sorted.length * 0.75) - 1
    return arr_sorted[quart]
}

function IQR(arr_sorted) {
    return percentile_75(arr_sorted) - percentile_25(arr_sorted)
}

let data_example = [2.3, 2.7, 3.1, 3.9, 4.2, 4.5, 4.8, 5.2, 6.0]

function to_bins(sorted_arr) {
    let min_val = minimum(sorted_arr)
    let max_val = maximum(sorted_arr)
    const NUM_BINS = 300
    let counts = Array(NUM_BINS).fill(0)
    let bin_width = (max_val - min_val) / NUM_BINS
    let bins = []
    for (var i = 0; i < NUM_BINS + 1; i++) {
        bins.push(min_val + i * bin_width)
    }
    for (var i=0; i<sorted_arr.length; i++) {
        let index = parseInt((sorted_arr[i] - min_val) / bin_width)
        if (index == NUM_BINS) {
            index --
        }
        counts[index] += 1
    }
    return [counts, bins]
}

let histogram = document.getElementById('histogram')
let hist_ctx = histogram.getContext('2d')

let box_plot = document.getElementById('box_plot')
let box_plot_ctx = box_plot.getContext('2d')

function drawBoxPlot(median, perc25, perc75, minimum, maximum, sorted_arr) {
    // scale - 1500 / 300, 110y, 
    // box 
    for (var i = -1; i < 2; i+=2) { 
        // horizontal
        box_plot_ctx.beginPath()
        box_plot_ctx.moveTo(10 + perc25 / 5, ((perc75 - perc25) / (5 * 2) * i + 110))
        box_plot_ctx.lineTo(10 + perc75 / 5, ((perc75 - perc25) / (5 * 2) * i + 110))
        box_plot_ctx.strokeStyle = 'grey'
        box_plot_ctx.lineWidth = 1         
        box_plot_ctx.stroke()
        // vertical
        let x = 0
        if (i == -1) {
            x = perc25
        }
        else {
            x = perc75
        }
        box_plot_ctx.beginPath()
        box_plot_ctx.moveTo(10 + x / 5, ((perc75 - perc25) / (5 * 2) * i + 110))
        box_plot_ctx.lineTo(10 + x / 5, ((perc75 - perc25) / (5 * 2) * -i + 110))
        box_plot_ctx.strokeStyle = 'grey'
        box_plot_ctx.lineWidth = 1         
        box_plot_ctx.stroke()
    }

    // whiskers
    let lower = minimum
    let upper = maximum
    if (perc25 - (perc75 - perc25) * 1.5 > lower) {
        lower = minimum - (maximum - minimum)
    }
    if (perc75 + (perc75 - perc25) * 1.5 < upper) {
        upper = perc75 + (perc75 - perc25) * 1.5
    }
    for (var i = 0; i < 2; i++) {
        let a, b, c
        if (i == 0) {
            a = lower
            b = perc25
            c = lower

        }
        else {
            a = perc75
            b = upper
            c = upper
        }
        box_plot_ctx.beginPath()
        box_plot_ctx.moveTo(10 + a / 5, 110)
        box_plot_ctx.lineTo(10 + b / 5, 110)
        box_plot_ctx.strokeStyle = 'grey'
        box_plot_ctx.lineWidth = 1         
        box_plot_ctx.stroke()

        box_plot_ctx.beginPath()
        box_plot_ctx.moveTo(10 + c / 5, 110 - (perc75 - perc25) / 20)
        box_plot_ctx.lineTo(10 + c / 5, 110 + (perc75 - perc25) / 20)
        box_plot_ctx.strokeStyle = 'grey'
        box_plot_ctx.lineWidth = 1         
        box_plot_ctx.stroke()
    }
    // median
    box_plot_ctx.beginPath()
    box_plot_ctx.moveTo(10 + median / 5, 110 - (perc75 - perc25) / 10)
    box_plot_ctx.lineTo(10 + median / 5, 110 + (perc75 - perc25) / 10)
    box_plot_ctx.strokeStyle = 'orange'
    box_plot_ctx.lineWidth = 1         
    box_plot_ctx.stroke()
    // outliers
    for (var i = 0; i < sorted_arr.length; i++) {
        if (sorted_arr[i] > upper) {
            drawDot(10 + sorted_arr[i] / 5, 110, 3, 'grey')
        }
    }

}

function cumulativeDF(sorted_arr) {
    let arr = {}
    let increment = 100 / sorted_arr.length
    let curr = increment
    for (var i = 0; i < sorted_arr.length; i++) {
        if (sorted_arr[i] in arr) {
            arr[sorted_arr[i]] += increment
        }
        else {
            arr[sorted_arr[i]] = curr
        }
        curr += increment
    }

    let cumulative = document.getElementById('cumulativeDF')
    let cumulative_ctx = cumulative.getContext('2d')

    let prev_x = 25
    let prev_y = arr[25]

    for (const key in arr) {
        const value = arr[key]

        cumulative_ctx.beginPath()
        cumulative_ctx.moveTo(10 + prev_x / 5, 220 - prev_y * 2)
        cumulative_ctx.lineTo(10 + key / 5, 220 - value * 2)
        cumulative_ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
        cumulative_ctx.lineWidth = 1         
        cumulative_ctx.stroke()

        prev_x = key
        prev_y = value
    }
}

function drawDot(x, y, r, color) {
    box_plot_ctx.beginPath()
    box_plot_ctx.arc(x, y, r, 0, 2 * Math.PI)
    box_plot_ctx.strokeStyle = color
    box_plot_ctx.stroke()
}

function gaussianKernel(x) {
    return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

function kde(data, bandwidth, numPoints = 1000) {
    if (data.length === 0) return { x: [], y: [] };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    const padding = range * 0.1; // Add 10% padding on each side

    const xValues = [];
    const yValues = [];

    // Generate x values across the range
    for (let i = 0; i < numPoints; i++) {
        xValues.push(min - padding + (range + 2 * padding) * (i / (numPoints - 1)));
    }

    // Calculate density at each x value
    for (let i = 0; i < xValues.length; i++) {
        let density = 0;
        for (let j = 0; j < data.length; j++) {
            const u = (xValues[i] - data[j]) / bandwidth;
            density += gaussianKernel(u);
        }
        density /= (data.length * bandwidth);
        yValues.push(density);
    }

    return { x: xValues, y: yValues };
}

function drawBins(bins, data) {
    // Clear canvas first
    hist_ctx.clearRect(0, 0, histogram.width, histogram.height);

    // Find max value for scaling histogram bars
    const maxBin = Math.max(...bins);
    const scale = 180 / maxBin; // Scale to fit in 180px height (leave room for KDE)

    // Draw bars
    const barWidth = histogram.width / bins.length;

    for (let i = 0; i < bins.length; i++) {
        const barHeight = bins[i] * scale;
        const x = i * barWidth + 10;
        const y = histogram.height - barHeight ; // Leave space at bottom

        // Draw filled rectangle
        hist_ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'; // Semi-transparent white
        hist_ctx.fillRect(x, y, barWidth - 1, barHeight);

        // Optional: draw outline
        hist_ctx.strokeStyle = 'rgb(176, 196, 222)';
        hist_ctx.lineWidth = 1;
        hist_ctx.strokeRect(x, y, barWidth - 1, barHeight);
    }

    // Draw KDE line if data is provided
    if (data && data.length > 0) {
        // Calculate bandwidth using Silverman's rule of thumb
        const dataStd = Math.sqrt(variance(data));
        const bandwidth = 1.06 * dataStd * Math.pow(data.length, -0.2);

        const kdeResult = kde(data, bandwidth, 500);

        // Scale KDE to fit the remaining height
        const maxDensity = Math.max(...kdeResult.y);
        const kdeScale = 180 / maxDensity;

        hist_ctx.strokeStyle = 'red';
        hist_ctx.lineWidth = 2;
        hist_ctx.beginPath();

        for (let i = 0; i < kdeResult.x.length; i++) {
            const x = ((kdeResult.x[i] - Math.min(...data)) / (Math.max(...data) - Math.min(...data))) * (histogram.width - 20) + 10;
            const y = histogram.height - (kdeResult.y[i] * kdeScale);

            if (i === 0) {
                hist_ctx.moveTo(x, y);
            } else {
                hist_ctx.lineTo(x, y);
            }
        }

        hist_ctx.stroke();
    }
}

function drawQQPlot(sorted_data) {
    const qqCanvas = document.getElementById('q_q');
    if (!qqCanvas) return; // Skip if canvas doesn't exist
    
    const ctx = qqCanvas.getContext('2d');
    ctx.clearRect(0, 0, qqCanvas.width, qqCanvas.height);
    
    const n = sorted_data.length;
    const mean_val = mean(sorted_data);
    const std_val = std(sorted_data, mean_val);
    
    // Accurate inverse normal (Acklam) to get theoretical z-quantiles
    function normInv(p) {
        if (p <= 0 || p >= 1) return NaN;
        // Coefficients in rational approximations
        const a1 = -39.6968302866538, a2 = 220.946098424521, a3 = -275.928510446969, a4 = 138.357751867269, a5 = -30.6647980661472, a6 = 2.50662827745924;
        const b1 = -54.4760987982241, b2 = 161.585836858041, b3 = -155.698979859887, b4 = 66.8013118877197, b5 = -13.2806815528857;
        const c1 = -0.00778489400243029, c2 = -0.322396458041136, c3 = -2.40075827716184, c4 = -2.54973253934373, c5 = 4.37466414146497, c6 = 2.93816398269878;
        const d1 = 0.00778469570904146, d2 = 0.32246712907004, d3 = 2.445134137143, d4 = 3.75440866190742;
        const plow = 0.02425;
        const phigh = 1 - plow;
        let q, r;
        if (p < plow) {
            q = Math.sqrt(-2 * Math.log(p));
            return (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
        }
        if (phigh < p) {
            q = Math.sqrt(-2 * Math.log(1 - p));
            return -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
        }
        q = p - 0.5;
        r = q * q;
        return (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q / (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
    }

    // Theoretical z-quantiles (standard normal) using p = (i+0.5)/n
    const theoretical = [];
    for (let i = 0; i < n; i++) {
        const p = (i + 0.5) / n;
        theoretical.push(normInv(p));
    }
    
    // Find plotting ranges
    const xMin = Math.min(...theoretical);
    const xMax = Math.max(...theoretical);
    const yMin = Math.min(...sorted_data);
    const yMax = Math.max(...sorted_data);
    
    // Plot points
    ctx.fillStyle = 'blue';
    for (let i = 0; i < n; i++) {
        const x = 20 + ((theoretical[i] - xMin) / (xMax - xMin)) * (qqCanvas.width - 40);
        const y = qqCanvas.height - 20 - ((sorted_data[i] - yMin) / (yMax - yMin)) * (qqCanvas.height - 40);
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Draw reference line: y = mean + std * z (map z on x-axis to sample quantile on y)
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // use extreme z values for endpoints
    const zMin = Math.min(...theoretical);
    const zMax = Math.max(...theoretical);
    const y1 = mean_val + std_val * zMin;
    const y2 = mean_val + std_val * zMax;
    const x1 = 20 + ((zMin - xMin) / (xMax - xMin)) * (qqCanvas.width - 40);
    const yy1 = qqCanvas.height - 20 - ((y1 - yMin) / (yMax - yMin)) * (qqCanvas.height - 40);
    const x2 = 20 + ((zMax - xMin) / (xMax - xMin)) * (qqCanvas.width - 40);
    const yy2 = qqCanvas.height - 20 - ((y2 - yMin) / (yMax - yMin)) * (qqCanvas.height - 40);
    ctx.moveTo(x1, yy1);
    ctx.lineTo(x2, yy2);
    ctx.stroke();
}

function runAnalysis() {
    // Performance comparison
    console.log('\n=== Performance Comparison ===');
    const testData = data.slice(0, 10000); // Use subset for timing

    console.time('Bubble Sort (10000 elements)');
    bubbleSort(testData.slice());
    console.timeEnd('Bubble Sort (10000 elements)');

    console.time('Quick Sort (10000 elements)');
    quickSort(testData.slice());
    console.timeEnd('Quick Sort (10000 elements)');

    console.time('Fast Sort (10000 elements)');
    fastSort(testData.slice());
    console.timeEnd('Fast Sort (10000 elements)');

    // let sorted_data = fastSort(data)
    
    console.log(variance(data))
    console.log(std(data))
    
    let sorted_data = quickSort(data)
    console.log(median(sorted_data))
    console.log(minimum(sorted_data), maximum(sorted_data))
    console.log(range(sorted_data))

    document.getElementById('sample_size').innerHTML = data.length
    document.getElementById('mean').innerHTML = mean(data)
    document.getElementById('median').innerHTML = median(sorted_data)
    document.getElementById('std').innerHTML = std(data)
    document.getElementById('variance').innerHTML = variance(data)
    document.getElementById('minimum').innerHTML = minimum(sorted_data)
    document.getElementById('maximum').innerHTML = maximum(sorted_data)
    document.getElementById('range').innerHTML = range(sorted_data)
    document.getElementById('p25').innerHTML = percentile_25(sorted_data)
    document.getElementById('p75').innerHTML = percentile_75(sorted_data)
    document.getElementById('intqr').innerHTML = percentile_75(sorted_data) - percentile_25(sorted_data)
    document.getElementById('skewness').innerHTML = skewness(sorted_data)
    document.getElementById('kurtosis').innerHTML = kurtosis(sorted_data) - 3
    document.getElementById('mode').innerHTML = `${mode(sorted_data)[0]} appears ${mode(sorted_data)[1]} times` 
    document.getElementById('uv').innerHTML = mode(sorted_data)[2]

    console.log(skewness(sorted_data))
    console.log(median(sorted_data))
    console.log(skewness(data))
    console.log('Raw kurtosis:', kurtosis(data))
    console.log('Excess kurtosis:', excessKurtosis(data))

    console.log(mode(data))
    console.log(percentile_25(sorted_data))
    console.log(percentile_75(sorted_data))
    console.log(IQR(sorted_data))

    // Additional analysis code
    console.log(sorted_data.length, 'sorted')
    console.log(data.length)

    console.log(to_bins(data_example)[0])
    drawBins(to_bins(sorted_data)[0], data)  // Pass data for KDE calculation
    drawBoxPlot(median(sorted_data), percentile_25(sorted_data), percentile_75(sorted_data),
        minimum(sorted_data), maximum(sorted_data), sorted_data)
    cumulativeDF(sorted_data)
    drawQQPlot(sorted_data)
    // median, perc25, perc75, minimum, maximum, sorted_arr
    console.log(to_bins(data_example))
    console.log(to_bins(data_example))
    console.log(parseInt(2.34))
}

// Load data when script runs
loadData();
