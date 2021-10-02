import { World, Entity } from './engine'
import { buildMap } from './controllers'

const world = new World()

const { cardinalEntity } = buildMap(world)

const cardinalShifter = document.getElementById('cardinalShifter')
cardinalShifter.addEventListener('click', () => {
  const { position } = cardinalEntity
  cardinalEntity.positionEntityAndChildren({
    x: position.x + 1
  })
})

const tunnelPlacer = document.getElementById('tunnelPlacer')
let tunnelClick = 1
tunnelPlacer.addEventListener('click', () => {
  world.defineEntity(new Entity({
    char: '#',
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
