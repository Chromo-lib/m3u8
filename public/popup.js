const onOpenPlayer = () => {
  chrome.tabs.create({ url: 'index.html' });
}

document.getElementById('open-player').addEventListener('click', onOpenPlayer);