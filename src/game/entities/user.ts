import { Entity, EntityProps, OptionalCoordinates } from '../../engine'

/** User constructor parameters */
export interface UserProps extends EntityProps {
    /**
     * Speed of player
     * *Should not be higher than any Wall width
     */
    speed?: number
}

/** User entity that navigates the world */
export class User extends Entity {
    /**
     * Speed of player
     * *Should not be higher than any Wall width
     */
    speed: number

    /** Sets keypress listeners and adds the entity to the World */
    constructor (props: UserProps) {
      super(props)
      this.speed = props.speed || 1
      this.setListeners()
      this.world.defineEntity(this)
    }

    /**
     * Handles key presses and moves entity in desired direction
     * @param direction Move direction
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
      }
    }

    /** Sets key event onto the dom */
    setListeners (): void {
      document.addEventListener('keypress', (e) => {
        this.move(e.key)
      })
    }

    /**
     * Inherited method from [[Entry]]
     *
     * Stops movement if contacted object responds with the callback
     * *See documentation here [[Entry.positionEntity]]
     * @param position Position for User to be moved to
     */
    positionEntity (position: OptionalCoordinates): void {
      let stop = false

      /**
       * Find parent entities at new position and call their
       *  [[Entity.onContact]] method
       */
      this.world.findParentEntities({ ...this.position, ...position })
        .forEach(e => {
          e.onContact(this, () => {
            stop = true
          })
        })

      if (stop) {
        return
      }
      super.positionEntity(position)
    }
}
