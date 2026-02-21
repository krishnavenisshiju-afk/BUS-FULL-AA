import './style.css'

let count = 0

const countDisplay = document.getElementById("count")
const enterBtn = document.getElementById("enterBtn")
const exitBtn = document.getElementById("exitBtn")

enterBtn.addEventListener("click", () => {
  count++
  countDisplay.textContent = count
})

exitBtn.addEventListener("click", () => {
  if (count > 0) {
    count--
    countDisplay.textContent = count
  }
})