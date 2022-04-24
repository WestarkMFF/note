const tableData = [
  { name: "小麦", time: "2" },
  { name: "胡萝卜", time: "10" },
  { name: "大豆", time: "20" },
]

const proxy = new Proxy(tableData, {
  get(target, value) {
    console.log(target, value)
    return target[value]
  },
})

proxy.push({ name: "甘蔗", time: "30" })

console.log(proxy)
console.log(tableData)

