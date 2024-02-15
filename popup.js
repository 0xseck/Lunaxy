
////////////////
let blockedHosts = ["example.com", "example.org"];

// Set the default list on installation.
browser.runtime.onInstalled.addListener(details => {
  browser.storage.local.set({
    blockedHosts: blockedHosts
  });
});

// Get the stored list
browser.storage.local.get(data => {
  if (data.blockedHosts) {
    blockedHosts = data.blockedHosts;
  }
});

// Listen for changes in the blocked list
browser.storage.onChanged.addListener(changeData => {
  blockedHosts = changeData.blockedHosts.newValue;
});

// Managed the proxy

// Listen for a request to open a webpage

// On the request to open a webpage
function handleProxyRequest(requestInfo, proxyType,proxyHost, proxyPort) {
// Read the web address of the page to be visited 
  const url = new URL(requestInfo.url);
// Determine whether the domain in the web address is on the blocked hosts list 
  if (blockedHosts.indexOf(url.hostname) == -1) {
// Write details of the proxied host to the console and return the proxy address
    console.log(`Proxying: ${url.hostname}`);
    console.log( {type: proxyType, host: proxyHost, port: proxyPort} )
    return {type: proxyType, host: proxyHost, port: proxyPort};
  }
// Return instructions to open the requested webpage
  return {type: "direct"};
}
async function handleProxy(requestInfo){
    
    const profileName = await getProfile().then(profile => profile.profile);
    let profileList = await getProfileList();
    let profileDetails = profileList.find(item => item.name == profileName);
    let proxyType = profileDetails.type;
    let proxyHost = profileDetails.host;
    let proxyPort = profileDetails.port;
    console.log("proxy settings ==> host: " + proxyHost + "port: " + proxyPort + "type: " + proxyType )
    return handleProxyRequest(requestInfo, proxyType, proxyHost, proxyPort)
}

async function getProfileList() {
    const result = await browser.storage.local.get(['profiles']);
    const profiles = result.profiles || [];

    return profiles;
}

async function getProfile(){
   return browser.storage.local.get(['profile']);
}

function setProfile(profileName){
    browser.storage.local.set({
      profile: profileName
    });
}
function setProfileList(profileList){

    browser.storage.local.set({
        profiles: profileList
    });
}
// Log any errors from the proxy script
browser.proxy.onError.addListener(error => {
  console.error(`Proxy error: ${error.message}`);
});

async function populateProfileList() {
  let profileArray;
  const profiles = await getProfileList();

  console.log("profiles:", profiles);
  profileArray = profiles;

//add direct profile on first run
  if (profiles.length === 0) {
    await browser.storage.local.set({
      profiles: [{"name":"Direct","type":"direct","url":"","port":null}]
    });
  }

  const selectionMenu = document.getElementById('profileSelection');

  profiles.forEach(item => {
    const option = document.createElement('option');
    option.value = item.name;
    option.text = item.name;
    selectionMenu.appendChild(option);
    selectionMenu.selectedIndex = -1;
  });
}
async function handleProfileSelection(){

    const profileSelection = document.getElementById('profileSelection');
    const currentProfile = document.getElementById("currentProfile");
    let profileText = await getProfile().then(profile => profile.profile);
    if (!profileText) {
        setProfile("Direct");
        console.log(await getProfile())
    }
    currentProfile.innerHTML = "Current Profile: " + profileText;

    profileSelection.addEventListener('change', function () {
        // This code will run when the profile selection changes
    const selectedProfile = profileSelection.value;
    currentProfile.innerHTML = "Current Profile: " + selectedProfile;
    setProfile(selectedProfile);
    console.log('Selected Profile:', selectedProfile);


    });

}
document.addEventListener('DOMContentLoaded', populateProfileList);
browser.proxy.onRequest.addListener(handleProxy, {urls: ["<all_urls>"]});
handleProfileSelection();

