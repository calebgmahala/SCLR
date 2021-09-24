/**
 * @packageDocumentation
 * @module World
 */

import { Entity } from '../entities/base'
import { Coordinates, OptionalCoordinates, OptionalSize, Size } from '../utils/types'

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
    /** size of World */
    size?: OptionalSize
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

    /** size of World */
    size: Size

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
      const { id, position, size, style } = props || {}
      this.position = { x: 0, y: 0, ...position }
      this.size = { width: 100, height: 100, ...size }
      this.dom = document.getElementById(id || 'world')
      this.#initializeStyles({ ...style })
      this.farthestCharX = Math.floor(this.dom.offsetWidth * 0.105) - 1
      this.farthestCharY = Math.floor(this.dom.offsetHeight * 0.054)
      this.#entityList = []
      this.#drawString = (' '.repeat(this.farthestCharX) + '\n').repeat(this.farthestCharY)
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
     * Add an entity to the list of rendered characters
     * @param {Entity} entity entity to be added
     */
    defineEntity (entity: Entity): void {
      const { char, position } = entity
      this.#entityList.push(entity)
      this.setCharAt(char, this.getEntityIndex(position))
      this.draw()
    }

    /**
     * remove a character from the list of rendered characters
     * @param {Entity} entity character to be removed
     */
    removeEntity (entityPosition: Coordinates): void {
      const { x, y } = entityPosition
      try {
        const entityIndex = this.#entityList.findIndex(({ position }) => (
          position.x === x && position.y === y
        ))
        this.#entityList.splice(entityIndex, 1)
        this.setCharAt(' ', this.getEntityIndex(entityPosition))
        this.draw()
      } catch (err) {

      }
    }

    /** Draws the World */
    draw (): void {
      this.dom.innerHTML = this.#drawString
    }

    /** Re draws World */
    reDraw (): void {
      this.#drawString = (' '.repeat(this.farthestCharX) + '\n').repeat(this.farthestCharY)
      this.#entityList.forEach(entity => {
        const { char, position } = entity
        this.setCharAt(char, this.getEntityIndex(position))
      })
      this.draw()
    }

    /**
     * Gets entities true position based off world position
     * @param {Coordinates}
     * @returns {Coordinates} true position
     */
    getEntityPosition ({ x, y }: Coordinates): Coordinates {
      return {
        x: x - this.position.x,
        y: y - this.position.y
      }
    }

    /**
     * Gets character index from x y position
     * @param {number} x x coordinate
     * @param {number} y y coordinate
     * @returns {number|null} character index of drawstring or null if not in draw window
     */
    protected getEntityIndex ({ x, y }: Coordinates): number|null {
      const newX = x - this.position.x
      const newY = y - this.position.y
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
    protected setCharAt (char: string, index: number|null): void {
      if (!index) {
        return
      }
      const string = this.#drawString
      this.#drawString = string.substr(0, index) + char + string.substr(index + 1)
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
}
