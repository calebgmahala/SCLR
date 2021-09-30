import { Entity } from '../entities/base'
import { Coordinates, OptionalCoordinates } from '../utils/types'

/** Style parameters */
export interface StyleProps {
    backgroundColor?: string
    color?: string
    height?: string
    top?: string
    width?: string
}

/** World constructor parameters */
export interface WorldProps {
    /** id of dom element for world to populate */
    id?: string

    /** coordinates of World starting position */
    position?: OptionalCoordinates

    /** css style of World element */
    style?: StyleProps
}

/** World class manages the World position and World rendering */
export class World {
    /** String to be rendered */
    #drawString: string

    /** List of entities in the World */
    #entityList: Entity[]

    /** total characters that can fit the width of the World on one line */
    #farthestCharX: number

    /** total lines that can fit the hight of the World */
    #farthestCharY: number

    /** html element that holds the World */
    dom: HTMLElement

    /** coordinates of World position */
    position: Coordinates

    constructor (props?: WorldProps) {
      const { id, position, style } = props || {}
      // Set up DOM
      this.dom = document.getElementById(id || 'world')
      this.#initializeStyles({ ...style })
      this.#setListeners()

      // Set position values
      this.position = { x: 0, y: 0, ...position }
      this.#farthestCharX = Math.floor(this.dom.offsetWidth * 0.105) - 1
      this.#farthestCharY = Math.floor(this.dom.offsetHeight * 0.054)

      // Set render values
      this.#entityList = []
      this.#drawString =
        (' '.repeat(this.#farthestCharX) + '\n')
          .repeat(this.#farthestCharY)

      this.draw()
    }

    /**
     * Initialize global World styles
     * @param props custom world css styles
     */
     #initializeStyles (props: StyleProps): void {
      const style = this.dom.style
      style.position = 'absolute'
      style.overflow = 'hidden'
      style.whiteSpace = 'pre'
      style.fontFamily = 'Courier New'
      style.width = props.width || '100vw'
      style.height = props.height || '90vh'
      style.top = props.top || '10vh'
      style.backgroundColor = props.backgroundColor || 'black'
      style.color = props.color || 'white'
    }

    /** Sets resize event on window */
    #setListeners (): void {
       window.addEventListener('resize', () => {
         this.#farthestCharX = Math.floor(this.dom.offsetWidth * 0.105) - 1
         this.#farthestCharY = Math.floor(this.dom.offsetHeight * 0.054)
         this.reDraw()
       })
     }

    /**
     * Add an Entity to the World
     * @param entity entity to be added
     */
    defineEntity (entity: Entity): void {
      // Define entity's children
      entity.children.forEach(e => this.defineEntity(e))

      this.#entityList.push(entity)
      this.drawEntity(entity)
    }

    /** Draws the World */
    draw (): void {
      this.dom.innerHTML = this.#drawString
    }

    /**
     * Draw a specific entity and it's children
     * *Does not add entity or entity's children to World. See
     *  [[World.defineEntity]]
     * @param entity Entity to be drawn
     */
    drawEntity (entity: Entity): void {
      // Don't draw entities on negative layers
      if (entity.layer < 0) {
        return
      }

      // Draw entity's children
      entity.children.forEach(e => this.drawEntity(e))

      // Skip drawing entity if another entity in same location has a higher
      //  layer
      if (this.findEntities(entity.position).some(e => {
        return e.layer > entity.layer
      })) {
        return
      }

      this.setDrawCharAt(entity.char, this.getEntityDrawStringIndex(entity))
      this.draw()
    }

    /**
     * Erase an Entity and it's children
     * *Does not remove entity or entity's children from the World. See
     *  [World.removeEntity]
     * @param entity entity to be removed
     */
    eraseEntity (entity: Entity): void {
      try {
        entity.children.forEach(e => this.eraseEntity(e))
        this.setDrawCharAt(' ', this.getEntityDrawStringIndex(entity))
        this.draw()
      } catch {}
    }

    /**
     * Finds entities at coordinates
     * *Does not return entity's parent element. See
     *  [[World.findParentEntities]]
     * @param position Position of entities to find
     * @returns Entities at position
     */
    findEntities ({ x, y }: Coordinates): Entity[] | undefined {
      return this.#entityList.filter(({ position }) => (
        position.x === x && position.y === y
      ))
    }

    /**
     * Finds entity's parent at coordinates
     * @param position Position of entities to find
     * @returns Entities at position
     */
    findParentEntities (position: Coordinates): Entity[] | undefined {
      const entities = this.findEntities(position)

      return entities.map(e => {
        return e.topParent
      })
    }

    /**
     * Gets Entity's draw string index
     * @param Entity Entity to get draw string index of
     * @returns {number|null} character index of drawstring or null if not in
     *  draw window
     */
    protected getEntityDrawStringIndex ({ position }: Entity): number|null {
      // Account for World position
      const newX = position.x - this.position.x
      const newY = position.y - this.position.y

      // If out of World draw range return no index
      if (
        newX < 0 ||
        newY < 0 ||
        newX > this.#farthestCharX ||
        newY > this.#farthestCharY) {
        return null
      }

      return (newX) + ((newY) * (this.#farthestCharX + 1))
    }

    /**
     * Gets Entity's true position based off world position
     * @param entity Entity to get position of
     * @returns Entity's true position in World
     */
    getEntityPosition ({ position }: Entity): Coordinates {
      return {
        x: position.x - this.position.x,
        y: position.y - this.position.y
      }
    }

    /** Re draws World */
    reDraw (): void {
      // Reset `#drawString`
      this.#drawString =
        (' '.repeat(this.#farthestCharX) + '\n')
          .repeat(this.#farthestCharY)

      // Loop through `#entityList` and select all entities to be drawn
      const drawList:any = {}
      this.#entityList.forEach(entity => {
        const { position, layer } = entity
        if (layer < 0 || drawList[`${position.x},${position.y}`] >= layer) {
          return
        }
        drawList[`${position.x},${position.y}`] = entity
      })

      // Draw all valid entities
      Object.values(drawList).forEach((entity: Entity) => {
        this.drawEntity(entity)
      })
      this.draw()
    }

    /**
     * Remove an Entity and it's children from the World
     * @param entity entity to be removed
     */
    removeEntity (entity: Entity): void {
      try {
        // Remove entity's children
        entity.children.forEach(e => this.removeEntity(e))

        // Get entity's index
        const entityIndex = this.#entityList.findIndex((e) => (
          e === entity
        ))

        this.#entityList.splice(entityIndex, 1)
        this.eraseEntity(entity)
      } catch {}
    }

    /**
     * Sets character into the drawstring
     * @param char character to be set
     * @param index index of drawstring to be replaced
     */
    protected setDrawCharAt (char: string, index: number|null): void {
      if (!index) {
        return
      }
      const currentString = this.#drawString
      this.#drawString =
        currentString
          .substr(0, index) + char + currentString
          .substr(index + 1)
    }

    /**
     * Set position of World
     * @param props new World position
     */
    setPosition (props: OptionalCoordinates): void {
      this.position = {
        ...this.position,
        ...props
      }

      this.reDraw()
    }
}
