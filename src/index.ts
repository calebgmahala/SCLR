import { User } from './game/entities/user'
import { World } from './engine/environments/world'
import { Wall } from './game/entities/wall'
import { Entity } from './engine/entities/base'

const world = new World()

const wallPlacer = document.getElementById('wallPlacer')
let wallClick = 0
wallPlacer.addEventListener('click', () => {
  const wall = new Wall({
    char: '+',
    position: {
      x: -1,
      y: -1
    },
    layer: -1,
    world
  })
  wall.createChildren([...Array(10).keys()].map(k =>
    ({
      position: {
        x: 20 + wallClick,
        y: k
      },
      layer: 5
    })
  ))
  world.defineEntity(wall)
  wallClick++
})

const wallRemover = document.getElementById('wallRemover')
let wallRemoverClick = 0
wallRemover.addEventListener('click', () => {
  world.findParentEntities({ x: 20 + wallRemoverClick, y: 2 }).forEach(e => {
    world.removeEntity(e)
  })
  wallRemoverClick++
})

const wallShifter = document.getElementById('wallShifter')
wallShifter.addEventListener('click', () => {
  world.findParentEntities({ x: 19 + wallClick, y: 3 }).forEach(e => {
    if (e instanceof Wall) {
      e.positionEntityAndChildren({
        y: e.position.y - 5,
        x: e.position.x
      })
    }
  })
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
