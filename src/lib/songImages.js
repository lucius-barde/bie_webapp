const SONG_ILLUSTRATIONS_URL = 'https://ierljtkznrwjcvxjrbqv.supabase.co/storage/v1/object/public/bardsinexile/bardsinexile-illustrations'

export const getSongImageUrl = (image) => {
  if (typeof image !== 'string' || !image.trim()) return null

  const imagePath = image.trim()
  if (/^https?:\/\//i.test(imagePath)) return imagePath

  const encodedPath = imagePath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  return `${SONG_ILLUSTRATIONS_URL}/${encodedPath}`
}
