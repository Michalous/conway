document.addEventListener('DOMContentLoaded', function() {
    var container = document.getElementById('game-container')
    const matrix_size = 32
    var canvas = document.getElementById('myCanvas')
    var ctx = canvas.getContext('2d')
    var restart = document.getElementById('restart')
    let previousStates = []

    let stableLine = 0

    restart.onclick = function() {window.location.reload()}
    
    for (var i = 0; i < matrix_size; i++) {
        for (var j = 0; j < matrix_size; j++) {
            var square = document.createElement('div')
            square.classList.add('square')
            if (Math.random() > 0.5) {
                square.classList.add('active')
            }
            square.dataset.w = i
            square.dataset.j = j
            container.appendChild(square)
        }
    }

    let timeout

    for (var i = 0; i < 1000; i++) {
        (function(i) {
            timeout = setTimeout(function() {
                drawGraph(i, countActiveSquares())
                drawSquares()
                if (isStable() && stableLine == 0) {
                    let message = document.getElementById('message')
                    message.innerHTML = `Stable in generation: ${i}`
                    message.classList.add('active')
                    drawStableLine(i)
                    stableLine++

                }
                document.getElementById('count').innerHTML = i
                document.getElementById('live_cells').innerHTML = countActiveSquares()
            }, i * 250)
        })(i);
    }
    
    function drawGraph(x, height) {
        let y = Math.round((320 / 500) * height)
        ctx.beginPath();

        // Set the stroke color to greem
        ctx.strokeStyle = 'green';
        
        // Move the drawing cursor to beginning
        ctx.moveTo(x, 320);

        // Draw a line to point B
        ctx.lineTo(x, 320 - y);

        // Draw the line by stroking the path
        ctx.stroke();
        // drawDot(x, height, 1)
    }

    function drawStableLine(it) {
        ctx.beginPath();
    
        // Set the stroke color to greem
        ctx.strokeStyle = 'yellow';
        
        // Move the drawing cursor to beginning
        ctx.moveTo(it, 320);
    
        // Draw a line to point B
        ctx.lineTo(it, 0);
    
        // Draw the line by stroking the path
        ctx.stroke();
        // drawDot(x, height, 1)
    }
    
    // function drawDot(x, y, r) {
    //     ctx.beginPath();
    //     ctx.arc(x, y, r, 0, 2 * Math.PI);
    //     ctx.fillStyle = 'white';
    //     ctx.fill();
    // }

    function isStable() {
        let pattern = ''
        let squares = document.querySelectorAll('.square')
        squares.forEach(square => {
            if (square.classList.contains('active')) {
                pattern += '1'
            }
            else {
                pattern += '0'
            }
        })
        if (previousStates.indexOf(pattern) == -1) {
            previousStates.push(pattern)
        }
        else {
            return true
        }
        return false 
    }
})

function drawSquares() {
    // clears all the squares and draws a new generation
    array_to_draw = checkSquares(32)
    let squares = document.querySelectorAll('.square')
    squares.forEach((square) => square.classList.remove('active'))
    for (var i = 0; i < array_to_draw.length; i++) {
        var elem = document.querySelector(`[data-w="${array_to_draw[i][0]}"][data-j="${array_to_draw[i][1]}"]`)
        elem.classList.add('active')
    }
}

function checkSquares(matrix_size) {
    let active_cells = []
    for (var i = 1; i < matrix_size - 1; i++) {
        for (var j = 1; j < matrix_size - 1; j++) {
            elem0 = document.querySelector(`[data-w="${i-1}"][data-j="${j-1}"]`)
            elem1 = document.querySelector(`[data-w="${i-1}"][data-j="${j}"]`)
            elem2 = document.querySelector(`[data-w="${i-1}"][data-j="${j+1}"]`)
            elem3 = document.querySelector(`[data-w="${i}"][data-j="${j-1}"]`)
            elem4 = document.querySelector(`[data-w="${i}"][data-j="${j}"]`)
            elem5 = document.querySelector(`[data-w="${i}"][data-j="${j+1}"]`)
            elem6 = document.querySelector(`[data-w="${i+1}"][data-j="${j-1}"]`)
            elem7 = document.querySelector(`[data-w="${i+1}"][data-j="${j}"]`)
            elem8 = document.querySelector(`[data-w="${i+1}"][data-j="${j+1}"]`)
            
            let arr = [elem0, elem1, elem2, elem3, elem5, elem6, elem7, elem8]
            let count_of_active_cells = 0
            for (var k = 0; k < arr.length; k++) {
                if (arr[k].classList.contains('active')) {
                    count_of_active_cells ++
                }
            }
            if (elem4.classList.contains('active') && (count_of_active_cells > 1 && count_of_active_cells < 4)) {
                active_cells.push([i,j])
            }
            if (!elem4.classList.contains('active') && count_of_active_cells == 3) {
                active_cells.push([i, j])
            }
        }
    }
    
    return active_cells
}

function countActiveSquares() {
    let totalActive = 0
    let squares = document.querySelectorAll('.square')
    squares.forEach(square => {
        if (square.classList.contains('active')) {
            totalActive++
        }
    })
    return totalActive
}