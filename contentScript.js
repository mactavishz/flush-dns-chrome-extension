const ALLOWED_ACTIONS = ['DNSFlushCompleted', 'DNSFlushFailed']

const contentPort = chrome.runtime.connect({
  name: 'content-script'
})

const script = document.createElement('script')
script.src = chrome.extension.getURL('inject.js')
document.head.appendChild(script)


window.addEventListener('message', function handleDNSFlushComplete (event) {
  const { action = null } = event.data
  if (~ALLOWED_ACTIONS.indexOf(action)) {
    contentPort.postMessage({ action })
  }
})