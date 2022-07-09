/**
 * 欧几里得算法
 * @param p
 * @param q
 * @returns
 */
function gcd(p: number, q: number): number {
  if (q == 0) return p

  const r = p % q

  return gcd(q, r)
}

// const result = gcd(10, 1800)

/**
 * 递归求阶乘
 * @param num
 * @param result
 */
function factorial(num: number, result = 0): number {
  const lastNum = num - 1
  const _res = result ? lastNum * result : num * lastNum

  if (lastNum != 1) {
    return factorial(lastNum, _res)
  }

  return _res
}

console.log(factorial(5))
export { gcd, factorial }

function fact(num: number): number {
  if (num == 1) {
    return 1
  } else {
    return num * fact(num - 1)
  }
}

console.log(fact(4))

/**
 * 递归求sum
 * @param arr
 * @returns
 */
function sum(arr: Array<number>): number {
  if (arr.length == 0) {
    return 0
  } else {
    return arr[0] + sum(arr.slice(1))
  }
}

console.log(sum([999, 2, 3]))

/**
 * 递归快速排序
 * @param arr
 */
function quickSort(arr: Array<number>): Array<number> {
  console.log("arr", arr)
  /**
   * base case
   *
   * 如果只包含 0 或者 1 个元素，那就是有序数组
   */
  if (arr.length < 2) {
    return arr
  } else {
    const pivot = arr[0]

    const less: Array<number> = [],
      greater: Array<number> = []

    /**
     * slice(1) 每一次都从第一位往后取
     */
    arr.slice(1).forEach((item) => {
      if (item <= pivot) {
        less.push(item)
      } else {
        greater.push(item)
      }
    })

    return [...quickSort(less), ...[pivot], ...quickSort(greater)]
  }
}

console.log(quickSort([9, 12, 100, 1]))

function ListNode(val: number, next?: number) {
  this.val = val === undefined ? 0 : val
  this.next = next === undefined ? null : next
}

var addTwoNumbers = function (l1, l2) {
  let val1 = l1.val
  let val2 = l2.val

  let sum = new ListNode(0)
}

console.log(addTwoNumbers([2, 4, 3], [5, 6, 4]))
