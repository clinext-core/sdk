import settings from 'settings-store'

export default async ({ domain, key, value, secure }) => {
  try {
    settings.setValue(key, value)
    return true
  } catch (e) {
    console.error('store save', e)
  }
  return false
}
