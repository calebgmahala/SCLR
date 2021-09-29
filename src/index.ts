import { Entity } from './engine/entities/base'
import { User } from './game/entities/user'
import { World } from './engine/environments/world'

const world = new World()

const placer = document.getElementById('placer')
let click = 1
placer.addEventListener('click', () => {
  world.defineEntity(new Entity({
    char: '@',
    position: {
      x: click,
      y: click
    },
    world
  }))
  click++
})

const remover = document.getElementById('remover')
let click2 = 1
remover.addEventListener('click', () => {
  world.removeEntity(world.findEntity({ x: click2, y: click2 }))
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

// eslint-disable-next-line
const player = new User({
  char: '*',
  position: {
    x: 20,
    y: 20
  },
  world
})
