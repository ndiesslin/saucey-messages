// Sauce list
var sauces = [
  { title: 'Mild', cssClass: 'sauce-packet--sauce-1', themeColor: '#f69e47'},
  { title: 'Hot', cssClass: 'sauce-packet--sauce-2', themeColor: '#fa6429'},
  { title: 'Fire', cssClass: 'sauce-packet--sauce-3', themeColor: '#f63e1c'},
  { title: 'Diablo', cssClass: 'sauce-packet--sauce-4', themeColor: '#5d0708'},
  { title: 'Wild', cssClass: 'sauce-packet--sauce-5', themeColor: '#0ece4b'}
];

// When flavors are clicked handle this
var flavorHandler = function(){
  document.addEventListener('click', function (event) {
    // If the clicked element doesn't have the right selector, bail
    if (!event.target.matches('.flavor-selector__input')) return;

    // get the clicked sauce value
    var selectedValue = event.target.attributes['value'].value
    var title = sauces[selectedValue]['title'];
    var cssClass = sauces[selectedValue]['cssClass'];
    var themeColor = sauces[selectedValue]['themeColor'];
    var targetTitle = document.querySelector('.sauce-packet__title');
    var saucePacket = document.querySelector('.sauce-packet');

    // Change title
    targetTitle.innerText = title;

    // Change css class on packet
    saucePacket.className = 'sauce-packet ' + cssClass;

    // Change document "theme" color
    changeThemeColor(themeColor);

    // Save message to url since we changed flavor
    saveMessageToUrl();
  }, false);
};

flavorHandler();

var changeThemeColor = function(themeColor){
  var metaThemeColor = document.querySelector('meta[name=theme-color]');
  metaThemeColor.setAttribute('content', themeColor);
}

// When share message is clicked handle this
var messageHandler = function(){
  document.addEventListener('input', function (event) {
    // If the clicked element doesn't have the right selector, bail
    if (!event.target.matches('.sauce-packet__message')) return;

    saveMessageToUrl();
  }, false);
};

messageHandler();

// Save message to URL
var saveMessageToUrl = function(){
  var url = new URL(window.location.href);
  var message = document.querySelector('.sauce-packet__message').innerText;

  // Add packet text to share url
  url.searchParams.set('packet-message', message);

  // Get current flavor
  var currentFlavor = document.querySelector('.flavor-selector__input:checked').value;

  // Add flavor to share url
  url.searchParams.set('flavor', currentFlavor);

  // Set copy link value
  document.querySelector('.sharing-links__copy-link').value = url;
}

// Get url params
function getUrlParams() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
  });
  return vars;
}

// Load page information if in url
var loadFromUrl = function(){
  var urlVariables = getUrlParams();
  var message = decodeURIComponent(urlVariables['packet-message']).replace(/\+/g,' ');
  var flavor = urlVariables['flavor'];

  if (message === 'undefined') {
    message = 'Write your saucey message here ;P';
  }

  // Set message
  document.querySelector('.sauce-packet__message').innerText = message;

  // Click our flavor
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

loadFromUrl();

// When flavors are clicked handle this
var copyHandler = function(){
  document.addEventListener('click', function (event) {
    // If the clicked element doesn't have the right selector, bail
    if (!event.target.matches('.sharing-links__copy')) return;
    event.preventDefault();

    copyLinkToClipboard();
  }, false);
};

copyHandler();

// Copy link url to clipboard
var copyLinkToClipboard = function(){
  // Get the text field
  var copyText = document.querySelector('.sharing-links__copy-link');

  // Set display to block so link can be copied
  copyText.style.display = 'block';

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); //For mobile device

  // Copy the text inside the text field
  document.execCommand('copy');

  // Set display to none so nothing is visible to the user for the copy link
  copyText.style.display = 'none';

  // Alert the copied text
  alert('Url to saucey message copied to clipboard');
}