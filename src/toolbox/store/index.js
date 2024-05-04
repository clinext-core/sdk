import get from './get.js'
import save from './save.js'
import remove from './remove.js'

export default ({ toolbox }) => {

  return {
    get,
    save,
    set: save,
    remove,
    delete: remove
  }
}

