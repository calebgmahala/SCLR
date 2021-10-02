import { World } from '../environments/world'
import { Coordinates, OptionalCoordinates } from '../utils/types'

/** Entity constructor parameters */
export interface EntityProps {
    /**
     * Character to be rendered by the world for this Entity
     *
     * Child entities of this entity will default to the set character
     */
    char?: string

    /**
     * Child entities of this entity
     *
     * Use children to create large entities or group small entities together
     */
    children?: Entity[]

    /**
     * Render Layer for this Entity
     *
     * *Entities with a higher layer will render over the other entities*
     *
     * *Child entities of this entity will default to the set layer*
     *
     * *Layer of less than 0 will not render*
    */
    layer?: number

    /**
     * Parent entity of this entity
     *
     * *For child entities only*
     *
     * *Parent is set automatically by the [[Entity.createChildren]] function*
     */
    parent?: Entity

    /**
     * Positional coordinates of this Entity
     *
     * Child entities of this entity will default to the set position
     */
    position?: OptionalCoordinates

    /** World this entity and all child entities lives in */
    world: World
}

export interface buildFromStringProps extends
 Omit<EntityProps, 'char' | 'parent' | 'children'> {}

/**
 * Updated [[EntityProps]] interface that does not accept
 *  values for `world` or `parent`
 */
export interface CreateChildrenProps extends
 Omit<EntityProps, 'world' | 'parent'> {}

/**
 * Base entity class for objects inside world
 *
 * Entities are placed and drawn inside a world. Entities can have children
 *  in order to render in multiple locations or over a larger area.
 */
export class Entity {
    /**
     * Character to be rendered by the world for this Entity
     *
     * Child entities of this entity will default to the set character
     */
    char: string

    /**
     * Child entities of this entity
     *
     * Use children to create large entities or group small entities together
     */
    children: Entity[]

    /**
     * Render Layer for this Entity
     *
     * *Entities with a higher layer will render over the other entities*
     *
     * *Child entities of this entity will default to the set layer*
     *
     * *Layer of less than 0 will not render*
    */
    layer: number

    /**
     * Parent entity of this entity
     *
     * *For child entities only*
     *
     * *Parent is set automatically by the [[Entity.createChildren]] function*
     */
    parent: Entity | null

    /**
     * Positional coordinates of this Entity
     *
     * Child entities of this entity will default to the set position
     */
    position: Coordinates

    /** World this entity and all child entities lives in */
    world: World

    constructor (props: EntityProps) {
      const { char, children, layer, parent, position, world } = props
      this.char = char || ' '
      this.children = children || []
      this.layer = layer || 0
      this.parent = parent || null
      this.position = { x: 0, y: 0, ...position }
      this.world = world
    }

    /**
     * Builds and returns parent entity based on a long string
     * @param buildString String used to build Entity from. The first non
     *  whitespace character in the string will be the parent and the rest of
     *  the characters will be created as children of that entity. Newline
     *  characters and whitespace characters are removed
     * @param options Parent constructor props. These options will get inherited
     *  by the parents generated children
     * @returns New parent entity of generated entities
     */
    static buildFromString (
      buildString: string,
      options: buildFromStringProps,
      buildParent = this.buildParent
    ): Entity {
      const stringList = buildString.split(/\r?\n/)
      let parentEntity: Entity
      const childrenValues:CreateChildrenProps[] = []

      // For each line of string build out child entities for parent
      stringList.forEach((line, yIndex) => {
        // Remove newline characters
        const updatedBuildString = line.replace(/(\r\n|\n|\r)/gm, '')

        // Create parents children entities
        updatedBuildString.split('').forEach(
          (char, xIndex) => {
            // Skip whitespace characters
            if (char === ' ') {
              return
            }

            const { position } = options
            const newPosition = {
              x: position && position.x ? position.x + xIndex : xIndex,
              y: position && position.y ? position.y + yIndex : yIndex
            }

            // If no parent Entity is created create one and skip
            if (!parentEntity) {
              /**
               * Build parent allows for subclasses to define what type of
               *  Entity parent should be
               */
              parentEntity = buildParent({
                ...options,
                char,
                position: newPosition
              })
              return
            }

            childrenValues.push({
              char,
              position: newPosition
            })
          }
        )
      })
      parentEntity.createChildren(childrenValues)
      console.log(parentEntity)
      return parentEntity
    }

    /**
     * Used to handle Entity creation inside of static class methods. If this
     *  function is not defined on a subclass, entity creation inside of class
     *  methods will default to [[Entity]]
     *
     * *Function should be defined by a subclass*
     * @param props New entity props
     * @return New instance of Entity
     */
    static buildParent (props: EntityProps): Entity {
      return new Entity(props)
    }

    /**
     * @returns Top layer parent or this if no parent
     */
    get topParent (): Entity {
      let entity: Entity = this
      do {
        if (entity.parent) {
          entity = entity.parent
        }
      } while (entity.parent)

      return entity
    }

    /**
     * @returns True position of Entity relative to World position
     */
    get truePosition (): Coordinates {
      return this.world.getEntityPosition(this)
    }

    /**
     * Create Entity children from from list of entity props
     *
     * All values undefined in parameters are inherited from this entity
     *  (the parent)
     * @param entities array of parameters to define and link new entity
     *  instances as children of this entity
     */
    createChildren (entities: CreateChildrenProps[]): void {
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

    /**
     * Used to handle Entity interaction in World. By default this function
     *  passes parameters to parent entity
     *
     * *Function should be defined by a subclass*
     * @param entity Entity that causes contact
     * @param callback Callback for Entity that caused contact
     */
    onContact (entity: Entity, callback: (props?: any) => void): void {
      if (this.parent) {
        this.parent.onContact(entity, callback)
      }
    }

    /**
     * Positions entity in World
     *
     * Removes current entity from world and checks if there is an entity to
     *  render in the previous location
     *
     * Sets new coordinates and redraws this entity
     *
     * *Does not position children see [[Entity.positionEntityAndChildren]]*
     * @param position New position of entity
     */
    positionEntity (position: OptionalCoordinates): void {
      this.world.removeEntity(this)

      // Redraw previous entity
      const previousEntity = this.world.findEntities(this.position)
      if (previousEntity) {
        previousEntity.forEach(e => {
          this.world.drawEntity(e)
        })
      }

      this.position = { ...this.position, ...position }
      this.world.defineEntity(this)
    }

    /**
     * Positions entity and all children in the World
     *
     * Children are positioned based on the difference between the new
     *  coordinates and this entity's old coordinates
     * @param position New position of entity
     */
    positionEntityAndChildren ({ x, y }: OptionalCoordinates): void {
      // Difference between new coords and old coords
      const xMove = x ? x - this.position.x : 0
      const yMove = y ? y - this.position.y : 0

      // Re-position Children
      this.children.forEach(e => {
        e.positionEntity({
          x: e.position.x + xMove,
          y: e.position.y + yMove
        })
      })

      this.positionEntity({
        x: this.position.x + xMove,
        y: this.position.y + yMove
      })
    }

    /** Redraw this Entity in the world */
    redrawEntity () {
      this.world.drawEntity(this)
    }
}
