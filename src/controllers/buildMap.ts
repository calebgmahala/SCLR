import { Entity, World } from '../engine'
import { Floor, User, Wall } from '../game'

/**
 * Builds map into world
 * @param world World to build map in
 * @returns Object of entities built by this function
 */
export const buildMap = (world: World): {
  cardinalEntity: Entity,
  user: User,
} => {
  const cardinalDirections = `
  ^ 
  w
<a  s>
  d 
  v
  `

  // 20x50 floor string
  const floorSpace = [
    ...Array(20).keys()
  ].map(k => [
    ...Array(50).keys()
  ]
    .map(k => '+')
    .join('')
  ).join('\n')

  // 22x52 wrapping wall string
  const walls = [
    '+' + [...Array(50).keys()].map(k => '-').join('') + '+',
    [...Array(20).keys()].map(k =>
      '|' + [...Array(50).keys()].map(k => ' ').join('') + '|'
    ).join('\n'),
    '+' + [...Array(50).keys()].map(k => '-').join('') + '+'
  ].join('\n')

  // Define cardinal entity
  const cardinalEntity = Entity.buildFromString(cardinalDirections,
    {
      position: {
        x: 10
      },
      world
    }
  )
  world.defineEntity(cardinalEntity)

  // Define floor entity
  world.defineEntity(Floor.buildFromString(floorSpace,
    {
      position: {
        x: 2,
        y: 10
      },
      layer: 0,
      world
    }
  ))

  // Define wall entity
  world.defineEntity(Wall.buildFromString(walls,
    {
      position: {
        x: 1,
        y: 9
      },
      layer: 0,
      world
    }
  ))

  // Define user entity
  const user = new User({
    char: '@',
    position: {
      x: 35,
      y: 15
    },
    layer: 10,
    world
  })
  world.defineEntity(user)

  return {
    cardinalEntity,
    user
  }
}
