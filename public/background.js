/* global chrome */

chrome.commands.onCommand.addListener(async (command) => {
    const openWebsite = (url) => {
        if (isValidURL(url)) {
            createTab(url);
        }
    };

    const isValidURL = (url) => {
        if (url.indexOf("http://") == 0 || url.indexOf("https://") == 0) {
            var res = url.match(
                /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
            );
            return res !== null;
        }
    };

    const createTab = async (url) => {
        let allWindows = await chrome.windows.getAll();
        let id = "";
        chrome.storage.local.get(["topMostWindow"], (item) => {
            let topMostWindowID = item.topMostWindow;

            allWindows.forEach((window) => {
                if (topMostWindowID === window.id) {
                    id = topMostWindowID;
                }
            });

            if (id !== "") {
                chrome.windows.update(id, { focused: true });
            }

            chrome.tabs.create({ url: url, active: true });
        });
    };

    chrome.storage.local.get(null, (item) => {
        let keypressed = command.slice(-1);
        if (["1", "2", "3", "4"].includes(keypressed)) {
            openWebsite(item[keypressed]);
            return;
        }
    });
});

// Keep track of last focused Chrome window including different virtual desktops.
chrome.windows.onFocusChanged.addListener(() => {
    chrome.windows.getCurrent((window) => {
        if (window.focused === true) {
            chrome.storage.local.set({
                topMostWindow: window.id,
            });
        }
    });
});
