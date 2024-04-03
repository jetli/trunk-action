import * as core from '@actions/core'
import * as io from '@actions/io'
import * as tc from '@actions/tool-cache'
import * as os from 'os'
import * as path from 'path'
import * as client from 'typed-rest-client/HttpClient'

const c: client.HttpClient = new client.HttpClient('vsts-node-api')

async function findVersionLatest(): Promise<string> {
  core.info('Searching the latest version of trunk ...')
  const response = await c.get(
    'https://api.github.com/repos/thedodd/trunk/releases/latest'
  )
  const body = await response.readBody()
  return Promise.resolve(JSON.parse(body).tag_name || 'v0.19.1')
}

async function findVersion(): Promise<string> {
  const version: string = core.getInput('version')
  if (version === 'latest' || version === null || version === undefined) {
    return await findVersionLatest()
  }
  return Promise.resolve(version)
}

export async function run(): Promise<void> {
  const tempFolder = path.join(os.tmpdir(), 'setup-trunk')
  await io.mkdirP(tempFolder)

  try {
    const version = await findVersion()
    if (!version.startsWith('v')) {
      core.setFailed('Version tag should start with `v`, eg. `v0.19.1`')
      return
    }
    core.info(`Installing trunk ${version} ...`)
    const platform = process.env['PLATFORM'] || process.platform
    core.debug(platform)

    let ext = ''
    let arch = ''
    let archExt = '.tar.gz'
    let extractFn = tc.extractTar
    switch (platform) {
      case 'win32':
        ext = '.exe'
        archExt = '.zip'
        arch = 'x86_64-pc-windows-msvc'
        extractFn = tc.extractZip
        break
      case 'darwin':
        arch = 'x86_64-apple-darwin'
        break
      case 'linux':
        arch = 'x86_64-unknown-linux-gnu'
        break
      default:
        core.setFailed(`Unsupported platform: ${platform}`)
        return
    }
    const archive = `trunk-${arch}`
    const url = `https://github.com/thedodd/trunk/releases/download/${version}/${archive}${archExt}`
    core.info(`Downloading trunk from ${url} ...`)
    const downloadArchive = await tc.downloadTool(url)
    core.info(`Extracting trunk to ${tempFolder} ...`)
    const extractedFolder = await extractFn(downloadArchive, tempFolder)
    const execFolder = path.join(os.homedir(), '.cargo', 'bin')
    await io.mkdirP(execFolder)
    const exec = `trunk${ext}`
    const execPath = path.join(execFolder, exec)
    await io.mv(path.join(extractedFolder, exec), execPath)
    core.info(`Installed trunk to ${execPath} 🎉`)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  } finally {
    io.rmRF(tempFolder)
  }
}
