;(function () {
  try {
    if (chrome.send) {
      chrome.send('clearHostResolverCache')
      chrome.send('flushSocketPools')
      chrome.send('closeIdleSockets')
    } else {
      throw new ReferenceError(`Can not find "send" method on chrome object`)
    }
    window.postMessage({
      action: 'DNSFlushCompleted'
    }, '*')
  } catch (err) {
    console.warn(err)
    window.postMessage({
      action: 'DNSFlushFailed'
    }, '*')
  }
})()