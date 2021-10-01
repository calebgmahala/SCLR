import { Entity } from '../../engine'
import { User } from './user'

/** Wall entity prevents [[User]] entity from moving through it */
export class Wall extends Entity {
  /**
   * Inherited method from [[Entity]]
   *
   * Checks if contact entity is an instance of [[User]]
   * *See documentation here [[Entry.onContact]]
   * @param entity Entity that caused the contact
   * @param callback Callback function for Entity that made contact
   */
  onContact (entity: Entity, callback: (props?: any) => void) {
    // If this is a child entity pass params contact call to parent
    if (this.parent) {
      super.onContact(entity, callback)
      return
    }

    if (entity instanceof User) {
      callback()
    }
  }
}
