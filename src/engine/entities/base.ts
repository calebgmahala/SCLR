/**
 * @packageDocumentation
 * @module Entity
 */

import { World } from '../environments/world'
import { Coordinates, OptionalCoordinates, OptionalSize, Size } from '../utils/types'

/**
 * Entity parameters
 */
export interface EntityProps {
    /** rendered character of the Entity */
    char: string
    /** coordinates of Entities starting position (top left of entity) */
    position: Coordinates
    /** size of Entity */
    size?: OptionalSize
    /** Entities World */
    world: World
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

    /** size of Entity */
    size: Size

    /** Entities World */
    protected world: World

    /**
     * Constructor for Entity class
     * @param {Object} props list of Entity attributes
     */
    constructor (props: EntityProps) {
      const { char, position, size, world } = props
      this.char = char
      this.position = position
      this.size = { width: 1, height: 1, ...size }
      this.world = world
    }

    /**
     * Position entity in World
     * @param {OptionalCoordinates} position New position of entity
     */
    positionEntity (position: OptionalCoordinates): void {
      this.world.removeEntity(this)
      const previousEntity = this.world.findEntity(this.position)
      if (previousEntity) {
        this.world.drawEntity(previousEntity)
      }
      this.position = { ...this.position, ...position }
      this.world.defineEntity(this)
    }

    /**
     * Redraw the Entity
     */
    redrawEntity () {
      this.world.drawEntity(this)
    }

    /**
     * True position of Entity relative to World position
     */
    get truePosition (): Coordinates {
      return this.world.getEntityPosition(this)
    }
}
