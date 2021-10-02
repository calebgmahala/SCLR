import {
  Entity,
  EntityProps
} from '../../engine'

/** Floor entity User walks on */
export class Floor extends Entity {
  /**
   * Inherited method from [[Entity]]
   *
   * Sets parent Entity creation to instance of [[Floor]]
   *
   * *See documentation here [[Entry.buildParent]]*
   * @param props Entity that caused the contact
   * @returns New instance of Floor
   */
  static buildParent (props: EntityProps): Floor {
    return new Floor(props)
  }
}
