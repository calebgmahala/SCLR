import { Entity } from './engine/entities/base'
import { World } from './engine/environments/world'

const world = new World()
const placer = document.getElementById('placer')
let click = 1
placer.addEventListener('click', () => {
  place('@', click, click)
  click++
})
const remover = document.getElementById('remover')
let click2 = 1
remover.addEventListener('click', () => {
  remove(click2, click2)
  click2++
})

const right = document.getElementById('right')
right.addEventListener('click', () => {
  world.setPosition({ x: world.position.x + 5 })
})
const left = document.getElementById('left')
left.addEventListener('click', () => {
  world.setPosition({ x: world.position.x - 5 })
})
const up = document.getElementById('up')
up.addEventListener('click', () => {
  world.setPosition({ y: world.position.y - 5 })
})
const down = document.getElementById('down')
down.addEventListener('click', () => {
  world.setPosition({ y: world.position.y + 5 })
})

function remove (x:any, y:any) {
  world.removeEntity({ x, y })
}
function place (c:any, x:any, y:any) {
  world.defineEntity(new Entity({
    char: c,
    position: {
      x,
      y
    },
    world
  }))
}
