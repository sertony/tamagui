import { execSync } from 'child_process'
import { homedir } from 'os'
import { join } from 'path'

import chalk from 'chalk'
import { copy, ensureDir, pathExists, remove } from 'fs-extra'
import { rimraf } from 'rimraf'
import { $, cd } from 'zx'

import { IS_TEST } from '../create-tamagui-constants'
import { templates } from '../templates'

const open = require('opener')

const home = homedir()
const tamaguiDir = join(home, '.tamagui')
let targetGitDir = ''

export const cloneStarter = async (
  template: (typeof templates)[number],
  resolvedProjectPath: string,
  projectName: string
) => {
  targetGitDir = IS_TEST
    ? join(tamaguiDir, 'tamagui-test', template.repo.url.split('/').at(-1)!)
    : join(tamaguiDir, 'tamagui', template.repo.url.split('/').at(-1)!)

  console.info()
  await setupTamaguiDotDir(template)
  const starterDir = join(targetGitDir, ...template.repo.dir)
  console.info()
  console.info(
    `Copying starter from ${starterDir} into ${chalk.blueBright(projectName)}...`
  )
  console.info()

  // if (!(await pathExists(starterDir))) {
  //   console.error(`Missing template for ${template.value} in ${starterDir}`)
  //   process.exit(1)
  // }
  await copy(starterDir, resolvedProjectPath)
  await rimraf(`${resolvedProjectPath}/.git`)

  console.info(chalk.green(`${projectName} created!`))
  console.info()
}

async function setupTamaguiDotDir(template: (typeof templates)[number], isRetry = false) {
  const repoRoot = join(__dirname, '..', '..', '..')

  console.info(`Setting up ${chalk.blueBright(targetGitDir)}...`)

  if (IS_TEST) {
    cd(repoRoot)
  }

  if (process.env.GITHUB_HEAD_REF) {
    try {
      await $`git switch -c ${process.env.GITHUB_HEAD_REF}`
    } catch {
      // re-tries branch already exists
    }
  }

  const branch = template.repo.branch

  // setup tests for CI
  if (IS_TEST) {
    console.info(`Test mode: cleaning old tamagui git dir`)
    // always clean for test
    await remove(targetGitDir)
    if (!(await pathExists(join(repoRoot, '.git')))) {
      throw new Error(`Not in a git folder`)
    }
  }

  await ensureDir(tamaguiDir)
  cd(tamaguiDir)

  const isInSubDir = template.repo.dir.length > 0

  if (!(await pathExists(targetGitDir))) {
    console.info(`Cloning tamagui base directory`)
    console.info()

    const sourceGitRepo = template.repo.url

    const cmd = `git clone --branch ${branch} ${
      isInSubDir ? '--depth 1 --sparse --filter=blob:none ' : ''
    }${sourceGitRepo} "${targetGitDir}"`

    try {
      try {
        console.info(`$ ${cmd}`)
        console.info()
        execSync(cmd)
      } catch (error) {
        if (cmd.includes('https://')) {
          console.info(`https failed - trying with ssh now...`)
          const sshCmd = cmd.replace('https://', 'ssh://')
          console.info(`$ ${sshCmd}`)
          console.info()
          execSync(sshCmd)
        } else {
          throw error
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        if (template.value === 'takeout-starter') {
          if ((error as any)?.stderr.includes('Repository not found')) {
            console.info(
              chalk.yellow(
                `You don't have access to this starter. Check 🥡 Tamagui Takeout (https://tamagui.dev/takeout) for more info.`
              )
            )
            open('https://tamagui.dev/takeout')
            process.exit(0)
          }
        }
      }
      throw error
    }
  } else {
    if (!(await pathExists(join(targetGitDir, '.git')))) {
      console.error(`Corrupt Tamagui directory, please delete ${targetGitDir} and re-run`)
      process.exit(1)
    }
  }
  console.info()
  console.info(`Updating tamagui starters repo`)
  console.info()

  if (isInSubDir) {
    const cmd = `git sparse-checkout set ${template.repo.dir[0] ?? '.'}`
    execSync(cmd, { cwd: targetGitDir })
    console.info()
    console.info(`$ ${cmd}`)
  }
  try {
    const cmd2 = `git pull --rebase --allow-unrelated-histories --depth 1 origin ${branch}`
    execSync(cmd2, {
      cwd: targetGitDir,
    })
    console.info()
    console.info(`$ ${cmd2}`)
  } catch (err: any) {
    console.info(
      `Error updating: ${err.message} ${
        isRetry ? `failing.\n${err.stack}` : 'trying from fresh.'
      }`
    )
    if (isRetry) {
      console.info(
        `Please file an issue: https://github.com/tamagui/tamagui/issues/new?assignees=&labels=&template=bug_report.md&title=`
      )
      process.exit(1)
    }
    await remove(targetGitDir)
    await setupTamaguiDotDir(template, true)
  }
}
