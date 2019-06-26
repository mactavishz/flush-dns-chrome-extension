const ALLOWED_EVENTS = ['DNSFlushCompleted', 'DNSFlushFailed']

const contentPort = chrome.runtime.connect({
  name: 'content-script'
})

chrome.runtime.onMessage.addListener(message => {
  if (message.action === 'DO_FLUSH') {
    let event = new CustomEvent('FLUSH_DNS')
    window.dispatchEvent(event)
  }
})

const script = document.createElement('script')
script.src = chrome.extension.getURL('inject.js')
document.head.appendChild(script)
script.addEventListener('load', () => {
  contentPort.postMessage({ event: 'DNSFlushScriptLoaded' })
})

window.addEventListener('message', function handleDNSFlushComplete (event) {
  const { event: eventName = null } = event.data
  if (~ALLOWED_EVENTS.indexOf(eventName)) {
    contentPort.postMessage({ event: eventName })
  }
})