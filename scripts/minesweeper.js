let rows
let columns
let mines
let remaining
let revealed
let totalTileNum
let startBtn = document.getElementById('bt-start')
let status = document.getElementById('status')
let table = document.getElementById('minesweeper')
// tile saves the position of mine in the table
let tile
// imgTable saves the array of actual image displayed on screen
let imgTable

changeStatus('Click on the tiles to reveal them')
startBtn.addEventListener('click', init)
init()

function init() {
  rows = parseInt(document.getElementById("input_row_num").value)
  columns = parseInt(document.getElementById("input_col_num").value)
  mines = parseInt(document.getElementById("input_mine_num").value)
  remaining = mines
  revealed = 0
  totalTileNum = rows * columns
  tile = new Array(totalTileNum)
  imgTable = new Array(totalTileNum)
  changeStatus("Mines remaining: " + remaining)

  initTable()
  initMines()
  checkMineNum()
}

function initTable() {
  // first clear the table
  table.innerHTML = ""
  for (let i = 0; i < rows; i++) {
    let row = table.insertRow(i)
    for (let j = 0; j < columns; j++) {
      // insert td cell at the last position in a row
      let cell = row.insertCell(-1)
      let cellImg = document.createElement('img')
      // the id of a cell is the index of whole table
      cellImg.id = i * columns + j
      cellImg.className = 'hidden'
      cellImg.src = './res/img/hidden.png'
      // cellImg.addEventListener('mousedown', click)
      imgTable[i * columns + j] = cellImg
      cell.appendChild(cellImg)
    }
  }
  table.addEventListener('mousedown', click)
}

function initMines() {
  let placed = 0
  while (placed < mines) {
    let pos = Math.floor(Math.random() * columns * rows)

    if (tile[pos] != 'mine') {
      tile[pos] = 'mine'
      placed++
    }
  }
}

function checkMineNum() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      let pos = row * columns + col
      if (check(row, col) != 'mine') {
        tile[pos] =
          ((check(row - 1, col - 1) == 'mine') | 0) +
          ((check(row - 1, col) == 'mine') | 0) +
          ((check(row - 1, col + 1) == 'mine') | 0) +
          ((check(row, col - 1) == 'mine') | 0) +
          ((check(row, col + 1) == 'mine') | 0) +
          ((check(row + 1, col - 1) == 'mine') | 0) +
          ((check(row + 1, col) == 'mine') | 0) +
          ((check(row + 1, col + 1) == 'mine') | 0)
      }
    }
  }
}

function check(row, col) {
  if (row >= 0 && col >= 0 && row < rows && col < columns)
    return tile[row * columns + col]
}

function click(event) {
  // if not clicked on a IMG tag, return
  if (event.target.nodeName != 'IMG') {
    return
  }
  let source = event.target
  let id = source.id
  let row = Math.floor(id / columns)
  let col = id % columns

  // if tile is revealed, click is useless
  if (source.className !== 'revealed') {
    // right click on a tile
    if (event.which == 3) {
      switch (source.className) {
        // change to flag
        case 'hidden':
          source.src = './res/img/flag.png'
          source.className = 'flag'
          remaining--
          break
        case 'flag':
          source.src = './res/img/question.png'
          source.className = 'question'
          remaining++
          break
        case 'question':
          source.src = './res/img/hidden.png'
          source.className = 'hidden'
          break
      }
      event.preventDefault()
      changeStatus("Mines remaining: " + remaining)
      return
    }


    // left mouse click a tile
    // if tile is flagged, nothing happens
    if (event.which === 1 && source.className !== 'flag') {
      // clicked on a mine, lose the game
      if (tile[id] === 'mine') {
        source.src = './res/img/mine.png'
        lose()
      } else {
        reveal(row, col)
      }
      // check if you win the game
      if (isWin()) {
        win()
      }
    }
  }
}

function reveal(row, col) {
  let pos = row * columns + col
  imgTable[pos].src = './res/img/' + tile[pos] + '.png'
  imgTable[pos].className = 'revealed'
  revealed++

  // reveal surrondings
  if (tile[pos] == 0) {
    if (col > 0 && imgTable[pos].className === 'hidden') reveal(row, col - 1) // left
    if (col < (columns - 1) && imgTable[pos + 1].className === 'hidden') reveal(row, col + 1) // right
    if (row < (rows - 1) && imgTable[pos + columns].className === 'hidden') reveal(row + 1, col) // down
    if (row > 0 && imgTable[pos - columns].className === 'hidden') reveal(row - 1, col) // up
    if (col > 0 && row > 0 && imgTable[pos - columns - 1].className === 'hidden') reveal(row - 1, col - 1) // up left
    if (col > 0 && row < (rows - 1) && imgTable[pos + columns - 1].className === 'hidden') reveal(row + 1, col - 1) // down left
    if (col < (columns - 1) && row < (rows - 1) && imgTable[pos + columns + 1].className === 'hidden') reveal(row + 1, col + 1) // down right
    if (col < (columns - 1) && row > 0 && imgTable[pos - columns + 1].className === 'hidden') reveal(row - 1, col + 1) // up right
  }
}

function gameover(condition) {
  // change the status text
  if (condition == 'win') {
    changeStatus('YOU WIN!\nClick button to restart')
  } else if (condition == 'lose') {
    changeStatus("GAME OVER")
  }
  // stop clicklistener of table
  table.removeEventListener('mousedown', click)
  // reveal all mines and misplaced flags
  for (let i = 0; i < totalTileNum; i++) {
    // show mines
    if (tile[i] == 'mine') {
      imgTable[i].src = './res/img/mine.png'
    }
    // show misplaced flags
    if (tile[i] != 'mine' && imgTable[i].classList.contains('flag')) {
      imgTable[i].src = './res/img/misplaced.png'
    }
  }
}

function changeStatus(str) {
  status.innerText = str
}

function isWin() {
  return (totalTileNum - revealed) == mines
}

function win() {
  gameover('win')
}

function lose() {
  gameover('lose')
}