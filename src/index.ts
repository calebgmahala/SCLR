import { User } from './game/entities/user'
import { World } from './engine/environments/world'
import { Wall } from './game/entities/wall'
import { Entity } from './engine/entities/base'

const world = new World()

const wallPlacer = document.getElementById('wallPlacer')
let wallClick = 1
wallPlacer.addEventListener('click', () => {
  world.defineEntity(new Wall({
    char: '+',
    position: {
      x: 20,
      y: wallClick
    },
    layer: 5,
    world
  }))
  wallClick++
})

const tunnelPlacer = document.getElementById('tunnelPlacer')
let tunnelClick = 1
tunnelPlacer.addEventListener('click', () => {
  world.defineEntity(new Entity({
    char: '@',
    position: {
      x: tunnelClick,
      y: 20
    },
    layer: 11,
    world
  }))
  tunnelClick++
})

const placer = document.getElementById('placer')
let click = 1
placer.addEventListener('click', () => {
  world.defineEntity(new Entity({
    char: 'B',
    position: {
      x: click,
      y: click
    },
    layer: 0,
    world
  }))
  click++
})

const remover = document.getElementById('remover')
let click2 = 1
remover.addEventListener('click', () => {
  world.findEntities({ x: click2, y: click2 }).forEach(e => {
    world.removeEntity(e)
  })
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
  layer: 10,
  world
})
