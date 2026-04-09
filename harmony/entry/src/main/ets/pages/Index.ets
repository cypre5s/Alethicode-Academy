import web_webview from '@ohos.web.webview'

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
