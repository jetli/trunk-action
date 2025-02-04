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
    const arch = process.env['ARCH'] || process.arch
    core.debug(platform)

    let ext = ''
    let targetArch = ''
    let targetPlatform = ''
    let platformExt = '.tar.gz'
    let extractFn = tc.extractTar
    switch (arch) {
      case 'x64':
        targetArch = 'x86_64'
        break
      case 'arm64':
        targetArch = 'aarch64'
        break
      default:
        core.setFailed(`Unsupported architecture: ${arch}`)
        return
    }
    switch (platform) {
      case 'win32':
        ext = '.exe'
        platformExt = '.zip'
        targetPlatform = 'pc-windows-msvc'
        extractFn = tc.extractZip
        break
      case 'darwin':
        targetPlatform = 'apple-darwin'
        break
      case 'linux':
        targetPlatform = 'unknown-linux-gnu'
        break
      default:
        core.setFailed(`Unsupported platform: ${platform}`)
        return
    }
    const archive = `trunk-${targetArch}-${targetPlatform}`
    const url = `https://github.com/thedodd/trunk/releases/download/${version}/${archive}${platformExt}`
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
