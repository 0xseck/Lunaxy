
document.getElementById('enableProxy').addEventListener('click', enableProxy);
document.getElementById('disableProxy').addEventListener('click', disableProxy);

function enableProxy() {

const proxyUri = document.getElementById('proxyURI').value;
console.log("TEST");
let proxySettings = {
  proxyType: "manual",
  ssl: proxyUri,
  socksVersion: 4
};

browser.proxy.settings.set({ value: proxySettings });
browser.proxy.settings.get({}).then((settings) => {
  console.log(settings.value);
});
}

function disableProxy() {
 console.log( browser.proxy.settings.clear({}));
browser.proxy.settings.get({}).then((settings) => {
  console.log(settings);
});
}
