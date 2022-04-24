const canvas = document.querySelector("#canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
console.log("ctx:", ctx)

ctx.fillStyle = "#ff0000"
ctx.fillRect(10, 10, 50, 50)

ctx.fillStyle = "rgba(0,0,255, 0.5)"
ctx.fillRect(30, 30, 50, 50)

ctx.clearRect(40, 40, 10, 10)
