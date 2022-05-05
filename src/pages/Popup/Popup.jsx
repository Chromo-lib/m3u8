import React from 'react';

let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
chrome = isChrome ? chrome : browser;

const Popup = () => {
  const onOpen = () => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      let activeTab = tabs[0];
      chrome.tabs.create({ url: 'panel.html' });
    });
  }

  return <button onClick={onOpen}>open player</button>
};

export default Popup;
