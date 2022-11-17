/* global chrome */
import React, { useEffect, useState } from "react";
import "./App.css";

function ShortcutsWindow() {
    const [urlData, setUrlData] = useState();
    const data = ["1", "2", "3", "4"];

    useEffect(async () => {
        chrome.storage.local.get(null, (item) => {
            setUrlData(item);
        });
    }, []);

    const saveURLs = () => {
        chrome.windows.getCurrent((currentWindow) => {
            chrome.storage.local.set({
                1: document.getElementById("ShortcutInput1").value,
                2: document.getElementById("ShortcutInput2").value,
                3: document.getElementById("ShortcutInput3").value,
                4: document.getElementById("ShortcutInput4").value,
                topMostWindow: currentWindow.id,
            });
        });
    };

    const createTab = async (url) => {
        await chrome.tabs.create({ url: url, active: true });
    };

    const closingScreen = () => {
        let squares = document.querySelectorAll(".hiddentile");
        squares.forEach((square) => (square.className = "hiddentile active"));
        setTimeout(() => {
            window.close();
        }, 1400);
    };

    const displayExistingUrlOrEmptyString = (num) => {
        if (num in urlData) {
            return urlData[num];
        } else {
            return "";
        }
    };

    return (
        <div className="ShortcutPage">
            {[...Array(5)].map(() => (
                <div className="hiddentile"></div>
            ))}
            <p className="header"> Website Shortcuts </p>
            {data.map((x) => (
                <input
                    className="InputField"
                    type="url"
                    id={`ShortcutInput${x}`}
                    name={`ShortcutInput${x}`}
                    autocomplete="off"
                    placeholder={`https://www.example.com/                                                    Shortcut ${x}`}
                    onFocus={(e) => e.target.select()}
                    spellcheck="false"
                    defaultValue={urlData ? displayExistingUrlOrEmptyString(x) : ""}
                    autoFocus={x === "1"}
                />
            ))}

            <button
                className="Button Keys"
                onClick={() => {
                    createTab("chrome://extensions/shortcuts");
                }}
            >
                Shortcuts
            </button>

            <button
                className="SaveButton"
                onClick={() => {
                    saveURLs();
                    closingScreen();
                }}
            >
                Save
            </button>

            <button
                className="Button Cancel"
                onClick={() => {
                    window.close();
                }}
            >
                Cancel
            </button>
        </div>
    );
}

export default ShortcutsWindow;
