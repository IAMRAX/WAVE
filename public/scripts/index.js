const urlInput = document.getElementById('url-input');
const goButton = document.getElementById('go-button');
const proxyFrame = document.getElementById('proxy-frame');

function encodeURL(url) {
  return __uv$config.prefix + __uv$config.encodeUrl(url);
}

function processURL(value) {
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }
  if (value.includes('.') && !value.includes(' ')) {
    return 'https://' + value;
  }
  return 'https://www.google.com/search?q=' + encodeURIComponent(value);
}

function loadURL() {
  const url = processURL(urlInput.value.trim());
  if (url) {
    proxyFrame.src = encodeURL(url);
  }
}

goButton.addEventListener('click', loadURL);

urlInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    loadURL();
  }
});
