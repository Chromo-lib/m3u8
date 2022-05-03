import React from 'react';

const Popup = () => {
  const onOpen = () => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      let activeTab = tabs[0];
      chrome.tabs.create({ url: 'panel.html?url' });
    });
  }

  return <button onClick={onOpen}>open player</button>
};

export default Popup;
