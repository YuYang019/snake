const container = document.querySelector('#content')

const xAxisCellCount = 45
const yAxisCellCount = 35
const cellWidth = 20
const allDirection = ['up', 'down', 'left', 'right']

const restart = document.querySelector('#restart')
const pauseBtn = document.querySelector('#pause')
const range = document.querySelector('#range')

let snake = []
let foods = []
let direction = getRandomDirection()
let snakeLength = 5
let pause = false
let speed = range.value
let ctx
let timer

function init () {
  const c = document.createElement('canvas')
  c.width = xAxisCellCount * cellWidth
  c.height = yAxisCellCount * cellWidth

  ctx = c.getContext('2d')

  container.appendChild(c)
}

function main () {
  getSnake()
  getFoods()
  addEvent()

  run()
}

function run () {
  clear()
  moveSnake()
  draw()

  timer = setTimeout(() => {
    run()
  }, 7000 / speed)

  const head = snake[0]
  if (
    outWall(head) ||
    impactMyself(head)
  ) {
    clearInterval(timer)
    drawDiedScene()
    console.log('died')
  }
}

function outWall (head) {
  if (
    head.x < 0 ||
    head.x > xAxisCellCount - 1 ||
    head.y < 0 ||
    head.y > yAxisCellCount - 1
  ) {
    return true
  }
}

function impactMyself (head) {
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true
    }
  }
  return false
}

function clear () {
  ctx.clearRect(0, 0, xAxisCellCount * cellWidth, yAxisCellCount * cellWidth)
}

function addEvent () {
  window.addEventListener('keyup', (e) => {
    switch (e.keyCode) {
      case 37:
        if (direction === 'left' || direction === 'right') break
        direction = 'left'
        break
      case 38:
        if (direction === 'up' || direction === 'down') break
        direction = 'up'
        break
      case 39:
        if (direction === 'right' || direction === 'left') break
        direction = 'right'
        break
      case 40:
        if (direction === 'down' || direction === 'up') break
        direction = 'down'
        break
      case 32:
        if (pause) {
          pause = false
          run()
        } else {
          pause = true
          clearInterval(timer)
        }
        break
      default:
        break
    }
  })

  restart.addEventListener('click', () => {
    reset()
    getSnake()
    getFoods()
    run()
  })
  pauseBtn.addEventListener('click', () => {
    if (pause) {
      pause = false
      run()
    } else {
      pause = true
      clearInterval(timer)
    }
  })
  range.addEventListener('change', () => {
    speed = range.value
  })
}

function reset () {
  snake = []
  direction = getRandomDirection()
  foods = []
  pause = false
  clearInterval(timer)
}

function getSnake () {
  const head = {
    x: Math.floor(xAxisCellCount / 2),
    y: Math.floor(yAxisCellCount / 2),
    color: 'red'
  }

  snake.push(head)

  if (direction === 'up') {
    for (let i = 0; i < snakeLength - 1; i++) {
      snake.push({
        x: head.x,
        y: head.y + (i + 1)
      })
    }
  } else if (direction === 'down') {
    for (let i = 0; i < snakeLength - 1; i++) {
      snake.push({
        x: head.x,
        y: head.y - (i + 1)
      })
    }
  } else if (direction === 'left') {
    for (let i = 0; i < snakeLength - 1; i++) {
      snake.push({
        x: head.x + (i + 1),
        y: head.y
      })
    }
  } else if (direction === 'right') {
    for (let i = 0; i < snakeLength - 1; i++) {
      snake.push({
        x: head.x - (i + 1),
        y: head.y
      })
    }
  }
}

// 每次移动，可以看成把最后一个cell挪到头部，如此反复
function moveSnake () {
  const oldHead = snake[0]
  const newHead = snake.pop()

  oldHead.color = null

  if (direction === 'up') {
    newHead.x = oldHead.x
    newHead.y = oldHead.y - 1
    newHead.color = 'red'

    snake.unshift(newHead)
  } else if (direction === 'down') {
    newHead.x = oldHead.x
    newHead.y = oldHead.y + 1
    newHead.color = 'red'

    snake.unshift(newHead)
  } else if (direction === 'left') {
    newHead.x = oldHead.x - 1
    newHead.y = oldHead.y
    newHead.color = 'red'

    snake.unshift(newHead)
  } else if (direction === 'right') {
    newHead.x = oldHead.x + 1
    newHead.y = oldHead.y
    newHead.color = 'red'

    snake.unshift(newHead)
  }

  // 吃了食物，在末尾加上cell，根据尾部的两个cell的相对位置，决定新加cell的位置
  if (eatFood()) {
    const tail1 = snake[snake.length - 1]
    const tail2 = snake[snake.length - 2]
    const cell = {}

    if (tail1.x === tail2.x) {
      if (tail2.y < tail1.y) {
        // 此时tail2在tail1的上方
        cell.x = tail1.x
        cell.y = tail1.y + 1
      } else {
        // 此时tail2在tail1的下方
        cell.x = tail1.x
        cell.y = tail1.y - 1
      }
    } else if (tail1.y === tail2.y) {
      if (tail2.x < tail1.x) {
        // 此时tail2在tail1的左方
        cell.y = tail1.y
        cell.x = tail1.x + 1
      } else {
        // 此时tail2在tail1的右方
        cell.y = tail1.y
        cell.x = tail1.x - 1
      }
    }

    snake.push(cell)
    getFoods()
  }
}

function eatFood () {
  const head = snake[0]
  for (let i = 0; i < foods.length; i++) {
    const food = foods[i]
    if (food.x === head.x && food.y === head.y) {
      foods.splice(i, 1)
      return true
    }
  }
  return false
}

function getRandomAxis () {
  return {
    x: Math.floor(Math.random() * xAxisCellCount),
    y: Math.floor(Math.random() * yAxisCellCount)
  }
}

function getRandomDirection () {
  const index = Math.floor(Math.random() * allDirection.length)

  return allDirection[index]
}

function drawCell (x, y, color) {
  ctx.fillStyle = color || '#000'
  ctx.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth)
}

function drawSnake () {
  for (let i = 0; i < snake.length; i++) {
    let cell = snake[i]
    drawCell(cell.x, cell.y, cell.color || null)
  }
}

function drawFoods () {
  foods.forEach(food => {
    drawCell(food.x, food.y, 'green')
  })
}

function getFoods () {
  const food = getRandomAxis()
  for (let i = 0; i < snake.length; i++) {
    if (food.x === snake[i].x && food.y === snake[i].y) {
      getFoods()
      return
    }
  }
  foods.push(food)
}

function drawDiedScene () {
  clear()
  ctx.fillStyle = '#000'
  ctx.font = '50px 微软雅黑'
  ctx.fillText('Game over', 300, (yAxisCellCount * cellWidth / 2))
}

function draw () {
  drawSnake()
  drawFoods()
}

init()
main()
