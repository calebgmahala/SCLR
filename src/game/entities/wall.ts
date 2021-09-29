/**
 * @packageDocumentation
 * @module Wall
 */
import { Entity } from '../../engine/entities/base'
import { User } from './user'

/** Wall entity
  * @category Entities
  */
export class Wall extends Entity {
  /** Inherited method from Entity
   * @param {Entity} entity Entity that caused the contact
   * @param {Function} callback Callback function for Entity that made contact
   */
  onContact (entity: Entity, callback: (props?: any) => void) {
    if (entity instanceof User) {
      callback()
    }
  }
}
