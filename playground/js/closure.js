// test 1
for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i)
  }, 1000)
}

// test 2 calculator
function createCalc() {
  let val = 0

  function add() {
    val++
    this.val = val
  }

  function minus() {
    val--
    this.val = val
  }

  return {
    val,
    add,
    minus,
  }
}

const calc = createCalc()
calc.add()
calc.add()
calc.add()
calc.add()
calc.minus()
calc.minus()
calc.minus()
calc.minus()
calc.minus()
calc.minus()
console.log(calc.val) // -2
