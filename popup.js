// Grab the checkbox element by id
const toggleSwitch = document.getElementById('toggleSwitch');

// Function for on-load read 
async function toggleStateRead() {
    const result = await chrome.storage.local.get('toggleSwitchState');
    toggleSwitch.checked = result.toggleSwitchState || false;
}

// Function for change will be called toggleStateWrite
// Inside that listener: chrome.storage.local.set(...) with the checkbox's new checked value
async function toggleStateWrite() {
    await chrome.storage.local.set({ toggleSwitchState: toggleSwitch.checked });
    
    if(toggleSwitch.checked) {
        try{
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const streamId = await chrome.tabCapture.getMediaStreamId({ targetTabId: tab.id });
            console.log('Toggle switch is ON, tabId is: ', tab.id, ' streamId is: ', streamId);     
            // chrome.runtime.sendMessage({ type: 'start-capture', streamId, tabId: tab.id });
        }
        catch (error) {
            console.error('Failed to start capture: ', error);
            toggleSwitch.checked = false;
            await chrome.storage.local.set({ toggleSwitchState: false });
        }
    }
    else{
        // chrome.runtime.sendMessage({ type: 'stop-capture' });
        console.log('Toggle switch is OFF');
    }
}

// Call toggleStateRead on load (immediately)
// We can trust that the DOM is already loaded because this script is included at the end of the body in popup.html
toggleStateRead();

// Add event listener for change
// using a function reference instead of a function call so that the function is only called when the event occurs. function() calls it immediately
toggleSwitch.addEventListener('change', toggleStateWrite);


