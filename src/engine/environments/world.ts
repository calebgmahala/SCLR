/**
 * @packageDocumentation
 * @module World
 */

import { Entity } from '../entities/base'
import { Coordinates, OptionalCoordinates } from '../utils/types'

/** Style parameters */
export interface StyleProps {
    height?: string
    width?: string
    top?: string
    backgroundColor?: string
    color?: string
}

/** World parameters */
export interface WorldProps {
    /** id of World dom element */
    id?: string
    /** coordinates of World starting position */
    position?: OptionalCoordinates
    /** css style of World element */
    style?: StyleProps
}

/**
 * World class manages the World position and World rendering
 * @category Environments
 */
export class World {
    /** html element that holds the world */
    dom: HTMLElement
    /** coordinates of World starting position */
    position: Coordinates
    /** total characters that can fit the width of the World on one line */
    farthestCharX: number
    /** total lines that can fit the hight of the World */
    farthestCharY: number
    /** List of entities to be rendered */
    #entityList: Entity[]
    /** String to be rendered */
    #drawString: string

    /**
     * Constructor for World class
     * @param {Object} props list of World attributes
     */
    constructor (props?: WorldProps) {
      const { id, position, style } = props || {}
      this.position = { x: 0, y: 0, ...position }
      this.dom = document.getElementById(id || 'world')
      this.#initializeStyles({ ...style })
      this.farthestCharX = Math.floor(this.dom.offsetWidth * 0.105) - 1
      this.farthestCharY = Math.floor(this.dom.offsetHeight * 0.054)
      this.#entityList = []
      this.#drawString = (' '.repeat(this.farthestCharX) + '\n').repeat(this.farthestCharY)
      this.#setListeners()
      this.draw()
    }

    /**
     * Set position of World
     * @param {OptionalCoordinates} props new World position
     */
    setPosition (props:OptionalCoordinates): void {
      this.position = {
        ...this.position,
        ...props
      }
      this.reDraw()
    }

    /**
     * Add an Entity
     * @param {Entity} entity entity to be added
     */
    defineEntity (entity: Entity): void {
      entity.children.forEach(e => this.defineEntity(e))
      this.#entityList.push(entity)
      this.drawEntity(entity)
    }

    /**
     * Draw a specific entity
     * @param {Entity} entity Entity to be drawn
     */
    drawEntity (entity: Entity): void {
      if (entity.layer < 0) {
        return
      }
      entity.children.forEach(e => this.drawEntity(e))
      if (this.findEntities(entity.position).some(e => {
        return e.layer > entity.layer
      })) {
        return
      }
      this.setDrawCharAt(entity.char, this.getEntityDrawStringIndex(entity))
      this.draw()
    }

    /**
     * Remove an Entitys
     * @param {Entity} entity entity to be removed
     */
    removeEntity (entity: Entity): void {
      try {
        entity.children.forEach(e => this.removeEntity(e))
        const entityIndex = this.#entityList.findIndex((e) => (
          e === entity
        ))
        this.#entityList.splice(entityIndex, 1)
        this.eraseEntity(entity)
      } catch {}
    }

    /**
     * Erase an Entitys
     * @param {Entity} entity entity to be removed
     */
    eraseEntity (entity: Entity): void {
      try {
        entity.children.forEach(e => this.eraseEntity(e))
        this.setDrawCharAt(' ', this.getEntityDrawStringIndex(entity))
        this.draw()
      } catch {}
    }

    /**
     * Finds Entity at coordinates
     * @param {Coordinates}
     * @returns {Entity} Entity at position
     */
    findEntities ({ x, y }: Coordinates): Entity[] | undefined {
      return this.#entityList.filter(({ position }) => (
        position.x === x && position.y === y
      ))
    }

    findParentEntities (position: Coordinates): Entity[] | undefined {
      const entities = this.findEntities(position)
      return entities.map(e => e.parent || e)
    }

    /** Draws the World */
    draw (): void {
      this.dom.innerHTML = this.#drawString
    }

    /** Re draws World */
    reDraw (): void {
      this.#drawString = (' '.repeat(this.farthestCharX) + '\n').repeat(this.farthestCharY)
      const drawList:any = {}
      this.#entityList.forEach(entity => {
        const { position, layer } = entity
        if (layer < 0 || drawList[`${position.x},${position.y}`] >= layer) {
          return
        }
        drawList[`${position.x},${position.y}`] = entity
      })
      Object.values(drawList).forEach((entity: Entity) => {
        this.drawEntity(entity)
      })
      this.draw()
    }

    /**
     * Gets Entities true position based off world position
     * @param {Entity}
     * @returns {Coordinates} true position
     */
    getEntityPosition ({ position }: Entity): Coordinates {
      return {
        x: position.x - this.position.x,
        y: position.y - this.position.y
      }
    }

    /**
     * Gets Entity index
     * @param {number} x x coordinate
     * @param {number} y y coordinate
     * @returns {number|null} character index of drawstring or null if not in draw window
     */
    protected getEntityDrawStringIndex ({ position }: Entity): number|null {
      const newX = position.x - this.position.x
      const newY = position.y - this.position.y
      if (newX < 0 || newY < 0 || newX > this.farthestCharX || newY > this.farthestCharY) {
        return null
      }
      return (newX) + ((newY) * (this.farthestCharX + 1))
    }

    /**
     * Sets character into the drawstring
     * @param {string} char character to be set
     * @param {number} index index of drawstring to be replaced
     */
    protected setDrawCharAt (char: string, index: number|null): void {
      if (!index) {
        return
      }
      const currentString = this.#drawString
      this.#drawString = currentString.substr(0, index) + char + currentString.substr(index + 1)
    }

    /**
     * Initialize global World styles
     * @param {object} props custom world css styles
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
        this.farthestCharX = Math.floor(this.dom.offsetWidth * 0.105) - 1
        this.farthestCharY = Math.floor(this.dom.offsetHeight * 0.054)
        this.reDraw()
      })
    }
}
