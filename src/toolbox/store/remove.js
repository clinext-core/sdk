import settings from 'settings-store'

export default async ({ key, secure }) => {
  try {
    settings.delete(key)
    return true
  } catch (e) {
    console.error('store remove', e)
  }
  return false
}
