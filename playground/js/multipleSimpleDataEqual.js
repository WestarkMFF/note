/**
 * 判断多个简单数据类型相等
 */

// es5
function isSimpleEqual_1() {
  if (arguments.length < 2) return false
  var flag = true
  for (var i = 0; i < arguments.length; i++) {
    for (var j = 0; j < arguments.length; j++) {
      if (arguments[i] !== arguments[j]) {
        flag = false
        break
      }
    }
  }

  return flag
}

let result_1 = isSimpleEqual_1(1, 1, 1)

console.log("result_1:", result_1)

// es6
function isSimpleEqual_2() {
  let args = Array.from(arguments)

  args.reduce((prev, cur) => {
    console.log("prev:", prev)
    console.log("cur:", cur)
  })
}

let result_2 = isSimpleEqual_2(999, 1223123, true)


console.log('result_2:', result_2);
