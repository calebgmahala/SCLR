/**
 * @packageDocumentation
 * @module User
 */
import { Entity, EntityProps } from '../../engine/entities/base'

/** User parameters */
export interface UserProps extends EntityProps {
    speed?: number
}

/** User entity that navigates the world
 * @category Entities
 */
export class User extends Entity {
    /** Speed of player */
    speed: number

    /** Constructor for User class */
    constructor (props: UserProps) {
      super(props)
      this.speed = props.speed || 1
      this.setListeners()
      this.world.defineEntity(this)
    }

    /**
     * Moves entity in desired direction
     * @param {'w'|'a'|'s'|'d'} direction Move direction
     */
    move (direction: string): void {
      const { x, y } = this.position
      switch (direction) {
        case 'w':
          this.positionEntity({ y: y - this.speed })
          break
        case 'a':
          this.positionEntity({ x: x - this.speed })
          break
        case 's':
          this.positionEntity({ y: y + this.speed })
          break
        case 'd':
          this.positionEntity({ x: x + this.speed })
          break
        default:
          console.log('Incorrect direction key try one of "wasd"')
      }
    }

    /** Sets key event onto the dom */
    setListeners (): void {
      document.addEventListener('keypress', (e) => {
        this.move(e.key)
      })
    }
}
