function randInt(from = 0, to = 1) {
  return Math.floor(from + Math.random() * (to - from))
}

function rand(from = 0, to = 1) {
  return from + Math.random() * (to - from)
}

class Snow {
  constructor(options = {}) {
    this.el = null
    this.d = 0 // 直径 diameter
    this.maxDiameter = options.maxDiameter || 80 // 最大直径
    this.minDiameter = options.minDiameter || 2 // 最小直径
    this.opacity = 0 // 透明度
    this.x = 0 // 左偏移量
    this.y = 0 // 右边偏移量
    this.sx = 0 // 水平速度
    this.sy = 0 // 垂直速度
    this.maxSpeed = options.maxSpeed || 4 // 最大速度
    this.minSpeed = options.minSpeed || 1 // 最小速度
    this.windowWidth = window.innerWidth // 窗口宽度
    this.windowHeight = window.innerHeight // 窗口高度
    // 近距离快速划过
    this.z = 0
    this.quickMaxSpeed = options.quickMaxSpeed || 10 // 最大速度
    this.quickMinSpeed = options.quickMinSpeed || 8 // 最小速度
    this.quickDiameter = options.quickDiameter || 80
    this.quickOpacity = options.quickOpacity || 0.2
    // 左右摇摆
    this.isSwing = false
    this.stepSx = 0.03
    // 初始化雪花
    this.init()
  }

  init() {
    const {
      minDiameter,
      maxDiameter,
      d,
      windowWidth,
      windowHeight,
      maxSpeed,
      minSpeed,
      quickMaxSpeed,
      quickMinSpeed,
      quickDiameter,
      quickOpacity,
    } = this
    const isQuick = Math.random() > 0.8
    this.isSwing = Math.random() > 0.8
    if (isQuick) {
      this.d = quickDiameter
      this.z = randInt(200, 500)
      this.opacity = quickOpacity
      this.sy = rand(quickMinSpeed, quickMaxSpeed)
    } else {
      this.d = randInt(minDiameter, maxDiameter)
      this.opacity = Math.random()
      this.sy = rand(minSpeed, maxSpeed)
    }
    this.x = randInt(d, windowWidth - d)
    this.y = randInt(d, windowHeight - d)
    this.sx = Math.random() * this.sy
  }

  setStyle() {
    const { d, opacity, x, y, z } = this
    this.el.style.cssText = `
      position: fixed;
      left: 0px;
      top: 0px;
      width: ${d}px;
      height: ${d}px;
      opacity: ${opacity};
      background-image: radial-gradient(#fff 0%, rgba(255, 255, 255, 0) 60%);
      border-radius: 50%;
      z-index: 100;
      pointer-events: none;
      transform: translate3d(${x}px, ${y}px, ${z}px);
    `
  }

  render() {
    const el = document.createElement('div')
    this.el = el
    this.setStyle()
    document.body.appendChild(el)
  }

  move() {
    const { windowWidth, windowHeight, d, sx, sy } = this
    // 摆荡效果
    if (this.isSwing) {
      const stepSx = this.sx >= 1 || this.sx <= -1 ? -this.stepSx : this.stepSx
      this.stepSx = stepSx
      this.sx += stepSx
    }
    // 更新位置
    this.x += sx
    this.y += sy
    // 抵达边缘
    if (this.x > windowWidth) this.x = -d
    if (this.y > windowHeight) {
      this.x = randInt(-d, windowWidth - d)
      this.y = -d
    }
    const { x, y, z } = this
    this.el.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`
  }
}

class SnowHandler {
  constructor() {
    this.snowList = []
    this.render = this.render.bind(this)
    this.clear = this.clear.bind(this)
    this.animationId = null
    this.delay = 200
    this.recent = performance.now()
    this.timeSpan = 30

    this.setListener()
    this.render()
  }

  render() {
    this.clear()
    const snowList = this.snowList
    const size = window.innerWidth * window.innerHeight
    const count = Math.floor(size / 3500)
    console.log(`snows count: ${count}`)
    for (let i = 0; i < count; i++) {
      const snow = new Snow()
      snow.render()
      snowList.push(snow)
    }
    this.move()
  }

  move() {
    const { recent, timeSpan } = this
    this.animationId = requestAnimationFrame((time) => {
      if (time - recent > timeSpan) {
        this.recent = time
        this.snowList.forEach((snow) => snow.move())
      }
      this.move()
    })
  }

  clear() {
    cancelAnimationFrame(this.animationId)
    for (const snow of this.snowList) {
      document.body.removeChild(snow.el)
    }
    this.snowList = []
  }

  setListener() {
    const { delay } = this
    let timer = null
    const { render, clear } = this
    window.onresize = function () {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        clear()
        render()
      }, delay)
    }
  }

  stop() {
    cancelAnimationFrame(this.animationId)
  }

  restart() {
    this.move()
  }
}

const handler = new SnowHandler()
// console.log(handler)

window.handler = handler
window.stop = function () {
  handler.stop()
}
window.restart = function () {
  handler.restart()
}
