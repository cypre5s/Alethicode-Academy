const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const HAP_DIR = path.join(ROOT, 'harmony')
const ENTRY_DIR = path.join(HAP_DIR, 'entry')
const RESOURCES_DIR = path.join(ENTRY_DIR, 'src', 'main', 'resources', 'rawfile')
const ETS_DIR = path.join(ENTRY_DIR, 'src', 'main', 'ets', 'pages')

if (!fs.existsSync(DIST)) {
  console.error('Error: dist/ not found. Run "npm run build" first.')
  process.exit(1)
}

function mkdirp(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function copyRecursive(src, dest) {
  if (fs.statSync(src).isDirectory()) {
    mkdirp(dest)
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry))
    }
  } else {
    fs.copyFileSync(src, dest)
  }
}

mkdirp(RESOURCES_DIR)
mkdirp(ETS_DIR)

console.log('Copying web assets to harmony/entry/src/main/resources/rawfile/ ...')
copyRecursive(DIST, RESOURCES_DIR)

const indexEts = `import web_webview from '@ohos.web.webview'

@Entry
@Component
struct Index {
  controller: web_webview.WebviewController = new web_webview.WebviewController()

  build() {
    Column() {
      Web({ src: $rawfile('index.html'), controller: this.controller })
        .javaScriptAccess(true)
        .domStorageAccess(true)
        .width('100%')
        .height('100%')
    }
    .width('100%')
    .height('100%')
  }
}
`

const indexPath = path.join(ETS_DIR, 'Index.ets')
if (!fs.existsSync(indexPath)) {
  fs.writeFileSync(indexPath, indexEts, 'utf8')
  console.log('Created Index.ets WebView page.')
}

const moduleJson = {
  module: {
    name: 'entry',
    type: 'entry',
    description: 'Alethicode Academy HarmonyOS entry module',
    mainElement: 'Index',
    deviceTypes: ['phone', 'tablet'],
    deliveryWithInstall: true,
    installationFree: false,
    pages: '$profile:main_pages',
    abilities: [
      {
        name: 'EntryAbility',
        srcEntry: './ets/entryability/EntryAbility.ets',
        description: 'Alethicode Academy',
        icon: '$media:app_icon',
        label: '$string:entry_label',
        startWindowIcon: '$media:app_icon',
        startWindowBackground: '$color:start_window_background',
        exported: true,
        skills: [
          {
            entities: ['entity.system.home'],
            actions: ['action.system.home'],
          },
        ],
      },
    ],
  },
}

const moduleJsonPath = path.join(ENTRY_DIR, 'src', 'main', 'module.json5')
mkdirp(path.dirname(moduleJsonPath))
if (!fs.existsSync(moduleJsonPath)) {
  fs.writeFileSync(moduleJsonPath, JSON.stringify(moduleJson, null, 2), 'utf8')
  console.log('Created module.json5')
}

const appJson = {
  app: {
    bundleName: 'com.alethicode.galgame',
    vendor: 'dhu_cypress',
    versionCode: 1000000,
    versionName: '1.0.0',
    icon: '$media:app_icon',
    label: '$string:app_name',
    minAPIVersion: 9,
    targetAPIVersion: 12,
  },
}

const appJsonPath = path.join(HAP_DIR, 'AppScope', 'app.json5')
mkdirp(path.dirname(appJsonPath))
if (!fs.existsSync(appJsonPath)) {
  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2), 'utf8')
  console.log('Created app.json5')
}

const mainPages = { src: ['pages/Index'] }
const profileDir = path.join(ENTRY_DIR, 'src', 'main', 'resources', 'base', 'profile')
mkdirp(profileDir)
fs.writeFileSync(path.join(profileDir, 'main_pages.json'), JSON.stringify(mainPages, null, 2), 'utf8')

const stringsDir = path.join(ENTRY_DIR, 'src', 'main', 'resources', 'base', 'element')
mkdirp(stringsDir)
const stringsJson = {
  string: [
    { name: 'entry_label', value: 'Alethicode Academy' },
    { name: 'app_name', value: 'Alethicode Academy' },
  ],
  color: [
    { name: 'start_window_background', value: '#f6efe8' },
  ],
}
fs.writeFileSync(path.join(stringsDir, 'string.json'), JSON.stringify(stringsJson, null, 2), 'utf8')

const iconSrc = path.join(ROOT, 'app-icon.png')
const mediaDir = path.join(ENTRY_DIR, 'src', 'main', 'resources', 'base', 'media')
mkdirp(mediaDir)
if (fs.existsSync(iconSrc)) {
  fs.copyFileSync(iconSrc, path.join(mediaDir, 'app_icon.png'))
  console.log('Copied app_icon.png')
}

const entryAbilityDir = path.join(ENTRY_DIR, 'src', 'main', 'ets', 'entryability')
mkdirp(entryAbilityDir)
const entryAbilityEts = `import UIAbility from '@ohos.app.ability.UIAbility'
import window from '@ohos.window'

export default class EntryAbility extends UIAbility {
  onWindowStageCreate(windowStage: window.WindowStage) {
    windowStage.loadContent('pages/Index')
  }
}
`
const entryAbilityPath = path.join(entryAbilityDir, 'EntryAbility.ets')
if (!fs.existsSync(entryAbilityPath)) {
  fs.writeFileSync(entryAbilityPath, entryAbilityEts, 'utf8')
  console.log('Created EntryAbility.ets')
}

const buildProfile = {
  apiType: 'stageMode',
  buildOption: {},
  targets: [{ name: 'default' }],
}
const buildProfilePath = path.join(ENTRY_DIR, 'build-profile.json5')
if (!fs.existsSync(buildProfilePath)) {
  fs.writeFileSync(buildProfilePath, JSON.stringify(buildProfile, null, 2), 'utf8')
}

const ohPackage = {
  name: 'entry',
  version: '1.0.0',
  description: 'Alethicode Academy entry module',
  main: '',
  author: 'dhu_cypress',
  license: '',
  dependencies: {},
}
const ohPackagePath = path.join(ENTRY_DIR, 'oh-package.json5')
if (!fs.existsSync(ohPackagePath)) {
  fs.writeFileSync(ohPackagePath, JSON.stringify(ohPackage, null, 2), 'utf8')
}

const rootBuildProfile = {
  app: {
    signingConfigs: [],
    products: [
      {
        name: 'default',
        signingConfig: 'default',
        compileSdkVersion: 12,
        compatibleSdkVersion: 9,
      },
    ],
  },
  modules: [
    {
      name: 'entry',
      srcPath: './entry',
      targets: [{ name: 'default', applyToProducts: ['default'] }],
    },
  ],
}
const rootBuildProfilePath = path.join(HAP_DIR, 'build-profile.json5')
if (!fs.existsSync(rootBuildProfilePath)) {
  fs.writeFileSync(rootBuildProfilePath, JSON.stringify(rootBuildProfile, null, 2), 'utf8')
}

console.log('')
console.log('HarmonyOS project scaffolded at harmony/')
console.log('To build the .hap:')
console.log('  1. Open harmony/ in DevEco Studio')
console.log('  2. Build > Build Hap(s)/APP(s) > Build Hap(s)')
console.log('  3. Output at harmony/entry/build/default/outputs/')
