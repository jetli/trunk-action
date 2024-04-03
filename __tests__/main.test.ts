import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import * as os from 'os'

// shows how the runner will run a javascript action with env / stdout protocol
test('a fixed version v0.10.0', () => {
  process.env['RUNNER_TEMP'] = os.tmpdir()
  process.env['INPUT_VERSION'] = 'v0.10.0'
  const ip = path.join(__dirname, '..', 'dist', 'index.js')
  const options: cp.ExecSyncOptions = {
    env: process.env
  }
  console.log(cp.execSync(`node ${ip}`, options).toString())
})

test('the latest version', () => {
  process.env['RUNNER_TEMP'] = os.tmpdir()
  process.env['INPUT_VERSION'] = 'latest'
  const ip = path.join(__dirname, '..', 'dist', 'index.js')
  const options: cp.ExecSyncOptions = {
    env: process.env
  }
  console.log(cp.execSync(`node ${ip}`, options).toString())
})
