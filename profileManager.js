
async function openProfileAdd(){

document.addEventListener('DOMContentLoaded', function () {
  const openProfileManagementButton = document.getElementById('openProfileManagement');

  openProfileManagementButton.addEventListener('click', function () {
    // Get the current extension popup window
    const popupWindow = browser.extension.getViews({ type: 'popup' })[0];

    // Check if the popup window exists
    if (popupWindow) {
      // Load the content of profileManagement.html into the popup
      popupWindow.location.href = 'profileManagement.html';
    }
  });
});

}
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('profileForm'); // Use the correct form ID
  const addButton = document.getElementById('addButton');

  addButton.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    handleProfileAdd(form);
  });

  async function handleProfileAdd(form) {
    // Access form elements using form object
    //const proxyNameInput = form.elements.proxyNameSelection;
    //const proxyNameErrorMessage = form.elements.proxyNameErrorMessage;

    // Validate Name
    //if (proxyNameInput.validity.patternMismatch) {
      //proxyNameErrorMessage.textContent = 'Please enter alphanumeric characters only.';
     // proxyNameInput.setCustomValidity('Please enter alphanumeric characters only.');
     // proxyNameInput.reportValidity();
    //} else {
     // proxyNameErrorMessage.textContent = '';
     // proxyNameInput.setCustomValidity('');
    //}

    // Perform similar validation for other fields...

    // If all validations pass, submit the form or perform further actions
    if (form.checkValidity()) {
      // Perform your submission logic here
      // For now, let's just log the data
      console.log('Profile Name:', form.elements.proxyNameSelection.value);
      console.log('Proxy Type:', form.elements.proxyTypeSelection.value);
      console.log('Proxy Host:', form.elements.proxyHostSelection.value);
      console.log('Proxy Port:', form.elements.proxyPortSelection.value);
      const newProfile = { name: form.elements.proxyNameSelection.value, type: form.elements.proxyTypeSelection.value, host: form.elements.proxyHostSelection.value, port: +form.elements.proxyPortSelection.value }; //+ is for int cast

      let currentProfileList = await getProfileList();
      currentProfileList.push(newProfile);  
      
      setProfileList(currentProfileList);
      // Clear the form
      form.reset();
    }
  }
});
openProfileAdd();
