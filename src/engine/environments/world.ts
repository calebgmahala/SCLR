/**
 * Style parameters
 */
export interface StyleProps {
    height?: string
    width?: string
    top?: string
    backgroundColor?: string
    color?: string
}

/**
 * Character properties
 */
export interface Character {
    /** Character */
    char: string
    /** x coordinate */
    x: number
    /** y coordinate */
    y: number
}

/**
 * World parameters
 */
export interface WorldProps {
    /** id of World dom element */
    id?: string
    /** coordinates of World starting position */
    position?: {
        /** x coordinate of World starting position */
        x?: number
        /** y coordinate of World starting position */
        y?: number
    }
    /** size of World */
    size?: {
        /** width of World */
        width?: number
        /** height of World */
        height?: number
    }
    /** css style of World element */
    style?: StyleProps
}

/**
 * World class manages the World position and World rendering
 */
class World {
    /** html element that holds the world */
    dom: HTMLElement
    /** coordinates of World starting position */
    position: {
        /** x coordinate of World starting position */
        x: number
        /** y coordinate of World starting position */
        y: number
    }

    /** size of World */
    size: {
        /** width of World */
        width: number
        /** height of World */
        height: number
    }

    /** total characters that can fit the width of the World on one line */
    farthestCharX: number
    /** total lines that can fit the hight of the World */
    farthestCharY: number
    /** List of characters to be rendered */
    #characterList: Character[]
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
      this.#characterList = []
      this.#drawString = (' '.repeat(this.farthestCharX) + '\n').repeat(this.farthestCharY)
      this.draw()
    }

    /**
     * Set position of World
     * @param {number} x world X position
     * @param {number} y world Y position
     */
    setPosition (props:{ x?: number, y?: number }): void {
      this.position = {
        ...this.position,
        ...props
      }
      this.reDraw()
    }

    /**
     * Add a character to the list of rendered characters
     * @param {Character} character character to be added
     */
    defineCharacter (character: Character): void {
      this.#characterList.push(character)
      this.setCharAt(character.char, this.getCharacterIndex(character.x, character.y))
      this.draw()
    }

    /**
     * remove a character from the list of rendered characters
     * @param {Character} character character to be removed
     */
    removeCharacter (character: Character): void {
      try {
        const characterIndex = this.#characterList.findIndex(({ x, y }) => (x === character.x && y === character.y))
        this.#characterList.splice(characterIndex, 1)
        this.setCharAt(' ', this.getCharacterIndex(character.x, character.y))
        this.draw()
      } catch (err) {

      }
    }

    /** Draws the World */
    draw (): void {
      this.dom.innerHTML = this.#drawString
    }

    /**
     * Re draws World
     */
    reDraw (): void {
      this.#drawString = (' '.repeat(this.farthestCharX) + '\n').repeat(this.farthestCharY)
      this.#characterList.forEach(character => {
        const { char, x, y } = character
        this.setCharAt(char, this.getCharacterIndex(x, y))
      })
      this.draw()
    }

    /**
     * Gets character index from x y position
     * @param {number} x x coordinate
     * @param {number} y y coordinate
     * @returns {number|null} character index of drawstring or null if not in draw window
     */
    protected getCharacterIndex (x:number, y:number): number|null {
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

export default World
