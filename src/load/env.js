import * as dotenv from 'dotenv';
import fs from 'fs';
import _path from 'path';
import checkFileExists from '../lib/checkFileExists.js';

dotenv.config()

export default async (props) => {
  const {
    projectSrcPath,
  } = props


  const env = process.env.NODE_ENV || 'production'
  const localEnv = await loadEnv({ env, projectSrcPath })
  return localEnv
}

const loadEnv = async ({ env, projectSrcPath }) => {
  const envFilePathRelative = env === 'development' ? '../.env.development' : '../.env'

  const envFilePath = _path.resolve(projectSrcPath, envFilePathRelative)
  // console.log('loadEnv', env, projectSrcPath, envFilePath, envFilePathRelative)
  if (!(await checkFileExists(envFilePath))) {
    // console.log('loadEnv: file does not exist',)
    return {}
  }

  let content = (await fs.promises.readFile(envFilePath)).toString()
  if (!content) {
    // console.log('loadEnv: no content',)
    return {}
  }

  const parsed = dotenv.parse(content)
  // console.log('loadEnv: content:', content, parsed)

  return parsed
}
