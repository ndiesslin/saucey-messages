// All document click handlers
var clickHandler = (function() {
  var initialize = function() {
    // When flavors are clicked handle this
    flavorHandler();

    // When share message is clicked handle this
    messageHandler();

    // When copy is clicked handle this
    copyHandler();
  }

  // Sauce list
  var sauces = [
    { title: 'Mild', cssClass: 'sauce-packet--sauce-1', themeColor: '#f69e47'},
    { title: 'Hot', cssClass: 'sauce-packet--sauce-2', themeColor: '#fa6429'},
    { title: 'Fire', cssClass: 'sauce-packet--sauce-3', themeColor: '#f63e1c'},
    { title: 'Diablo', cssClass: 'sauce-packet--sauce-4', themeColor: '#5d0708'},
    { title: 'Wild', cssClass: 'sauce-packet--sauce-5', themeColor: '#0ece4b'}
  ];

  var flavorHandler = function() {
    document.addEventListener('click', function (event) {
      // If the clicked element doesn't have the right selector, bail
      if (!event.target.matches('.flavor-selector__input')) return;
  
      // get the clicked sauce value
      var selectedValue = event.target.attributes['value'].value
      var targetTitle = document.querySelector('.sauce-packet__title');
      var saucePacket = document.querySelector('.sauce-packet');
  
      // Change title
      targetTitle.innerText = sauces[selectedValue]['title'];
  
      // Change css class on packet
      saucePacket.className = 'sauce-packet ' + sauces[selectedValue]['cssClass'];
  
      // Change document "theme" color
      changeThemeColor(sauces[selectedValue]['themeColor']);
  
      // Save message to url since we changed flavor
      message.save();
    }, false);
  }

  // Change theme color of wanted
  var changeThemeColor = function(themeColor){
    var metaThemeColor = document.querySelector('meta[name=theme-color]');
    metaThemeColor.setAttribute('content', themeColor);
  }

  var messageHandler = function() {
    document.addEventListener('input', function (event) {
      // If the clicked element doesn't have the right selector, bail
      if (!event.target.matches('.sauce-packet__message')) return;
  
      message.save();
    }, false);
  }

  // When copy is clicked
  var copyHandler = function(){
    document.addEventListener('click', function (event) {
      // If the clicked element doesn't have the right selector, bail
      if (!event.target.matches('.sharing-links__copy')) return;
      event.preventDefault();

      // Copy to clipboard
      copyLinkToClipboard();

      // Alert the copied text
      alertMessage.initialize();
    }, false);
  };

  // Copy link url to clipboard
  var copyLinkToClipboard = function(){
    // Get the text field
    var copyText = document.querySelector('.sharing-links__copy-link');

    // Add display block class so link can be copied
    copyText.classList.add('display-block');

    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); //For mobile device

    // Copy the text inside the text field
    document.execCommand('copy');

    // Remove display block class so nothing is visible to the user for the copy link
    copyText.classList.remove('display-block');
  }

  // Exposed functions
  return {
    initialize: initialize
  };
})();

clickHandler.initialize();

// Message handler
var message = (function() {
  // Save message to clipboard
  var saveMessage = function() {
    var url = new URL(window.location.href);
    var message = document.querySelector('.sauce-packet__message').innerText;
    var currentFlavor = document.querySelector('.flavor-selector__input:checked').value;
  
    // Add packet text to share url
    url.searchParams.set('packet-message', message);
  
    // Add flavor to share url
    url.searchParams.set('flavor', currentFlavor);
  
    // Set copy link value
    document.querySelector('.sharing-links__copy-link').value = url;
  }

  var loadMessage = function() {
    var urlVariables = getUrlParams();
    var message = decodeURIComponent(urlVariables['packet-message']).replace(/\+/g,' ');
    var flavor = urlVariables['flavor'];

    if (message === 'undefined') { 
      message = 'Write your saucey message here ;P'; 
    }

    // Set message
    document.querySelector('.sauce-packet__message').innerText = message;

    // Click our flavor
    clickFlavor(flavor);
  }

  // Get url params
  var getUrlParams = function() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
  }

  // Click our flavor
  var clickFlavor = function(flavor) {
    var flavorOptions = document.querySelectorAll('.flavor-selector__input');
    for (i = 0; i < flavorOptions.length; i++) {
      if (flavorOptions[i].value == flavor) {
        flavorOptions[i].click();

        // Break out of for loop
        break;
      }
      // If we looped through all and didn't find a flavor to select default to first
      if (i == flavorOptions.length - 1) {
        document.querySelector('.flavor-selector__input').click();
      }
    }
  }

  // Exposed functions
  return {
    save: saveMessage,
    load: loadMessage
  };
})();

// Load message on document load
message.load();

var alertMessage = (function() {
  var element = document.querySelector('.sharing-links__copy-message');

  var initialize = function() {
    showElement();
    triggerHide();
  }

  // Show element
  var showElement = function() {
    // Add display block class to show message
    element.classList.add('display-block');
  }

  // Hide element after time
  var triggerHide = function() {
    setTimeout(
      function(){ 
        // Remove display block class to hide message
        element.classList.remove('display-block');
      }, 
      3000
    );
  }

  // Exposed functions
  return {
    initialize: initialize
  };
})();