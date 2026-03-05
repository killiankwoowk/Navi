import SparkMD5 from 'spark-md5'

const RANDOM_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789'

export const randomSalt = (length = 8): string => {
  let salt = ''
  for (let i = 0; i < length; i += 1) {
    salt += RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)]
  }
  return salt
}

export const md5 = (value: string): string => SparkMD5.hash(value)
