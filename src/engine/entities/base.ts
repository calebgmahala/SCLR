/**
 * @packageDocumentation
 * @module Entity
 */

import { World } from '../environments/world'
import { Coordinates, OptionalCoordinates } from '../utils/types'

/**
 * Entity parameters
 */
export interface EntityProps {
    /** rendered character of the Entity */
    char?: string
    /** coordinates of Entities starting position (top left of entity) */
    position?: OptionalCoordinates
    /** Entities World */
    world: World
    /** Render Layer (Layer of less than 0 will not render) */
    layer?: number
    /** Child entities */
    children?: Entity[]
    /** Parent entity */
    parent?: Entity
}

/**
 * Base entity class for objects inside world
 * @category Entities
 */
export class Entity {
    /** rendered character of the Entity */
    char: string
    /** coordinates of Entities starting position (top left of entity) */
    position: Coordinates
    /** Render Layer (Layer of less than 0 will not render) */
    layer: number
    /** Parent entity */
    parent: Entity | null
    /** Children */
    children: Entity[]
    /** Entities World */
    world: World

    /**
     * Constructor for Entity class
     * @param {Object} props list of Entity attributes
     */
    constructor (props: EntityProps) {
      const { char, position, children, parent, layer, world } = props
      this.char = char || ' '
      this.position = { x: 0, y: 0, ...position }
      this.layer = layer || 0
      this.world = world
      this.children = children || []
      this.parent = parent || null
    }

    /**
     * Position entity in World
     * @param {OptionalCoordinates} position New position of entity
     */
    positionEntity (position: OptionalCoordinates): void {
      this.world.removeEntity(this)
      const previousEntity = this.world.findEntities(this.position)[0]
      if (previousEntity) {
        this.world.drawEntity(previousEntity)
      }
      this.position = { ...this.position, ...position }
      this.world.defineEntity(this)
    }

    /**
     * Interface function that should be defined by a subclass
     * Used to handle Entity interaction in World
     * @param {Entity} entity Entity that causes contact
     * @param {Function} callback Callback to Entity that caused contact
     */
    onContact (entity: Entity, callback: (props?: any) => void): void {}

    /**
     * Redraw the Entity
     */
    redrawEntity () {
      this.world.drawEntity(this)
    }

    /** Create Entity children from from list of entity props */
    createChildren (entities: Omit<EntityProps, 'world' | 'parent'>[]): void {
      this.children = entities.map(e => {
        return new Entity({
          char: e.char || this.char,
          position: {
            ...this.position,
            ...e.position
          },
          layer: e.layer || this.layer,
          parent: this,
          world: this.world
        })
      })
    }

    positionEntityAndChildren ({ x, y }: OptionalCoordinates): void {
      const xMove = x ? x - this.position.x : this.position.x
      const yMove = y ? y - this.position.y : this.position.y
      this.children.forEach(e => {
        e.positionEntity({
          x: e.position.x + xMove,
          y: e.position.y + yMove
        })
      })
      this.positionEntity({ x, y })
    }

    /**
     * True position of Entity relative to World position
     */
    get truePosition (): Coordinates {
      return this.world.getEntityPosition(this)
    }
}
