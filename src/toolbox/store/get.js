import settings from 'settings-store'

export default async ({ domain, key, secure }) => {
  try {
    return settings.value(key, 0)
  } catch (e) {
    console.error('netrc', e)
  }
  return null
}
