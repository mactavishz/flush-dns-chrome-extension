let chromeNetInternalTabId = null
const chromeNetInternalsUrl = 'chrome://net-internals/#dns'

const EVENT_STRATEGIES = {
  'DNSFlushScriptLoaded': function DNSFlushScriptLoadedHandler () {
    chrome.tabs.sendMessage(chromeNetInternalTabId, { action: 'DO_FLUSH' })
  },
  'DNSFlushCompleted': function DNSFlushCompletedHandler () {
    sendSuccessNotification('Congrats, DNS Flushed')
    closeTab(chromeNetInternalTabId)
  },
  'DNSFlushFailed': function DNSFlushFailedHandler () {
    sendSuccessNotification('Sorry, can not Flush DNS as expected')
    closeTab(chromeNetInternalTabId)
  }
}

chrome.browserAction.onClicked.addListener(() => {
  openTab(chromeNetInternalsUrl)
})

chrome.runtime.onConnect.addListener(portFrom => {
  if(portFrom.name === 'content-script') {
     portFrom.onMessage.addListener((data = { event: 'none' }) => {
       const handler = EVENT_STRATEGIES[data.event]
       if (handler) handler.call(null)
     })
  }
})

function openTab (url = '') {
  chrome.tabs.create({ url }, tab => {
    chromeNetInternalTabId = tab.id
  })
}

function closeTab (id = null) {
  if (id !== null) chrome.tabs.remove(id)
}

function sendSuccessNotification (message) {
  chrome.notifications.create({
    type: 'basic',
    title: 'Flush DNS Notification',
    message,
    iconUrl: 'images/icon-128px.png'
  })
}