// Saves options to chrome.storage
function save_options() {
  var replaceCopy = document.getElementById('replaceCopy').checked;
  var clipTemplate = document.getElementById('clipTemplate').value;
  var clipTemplateSol = document.getElementById('clipTemplateSol').value;
  chrome.storage.sync.set({
    replaceCopy: replaceCopy,
    clipTemplate: clipTemplate,
    clipTemplateSol: clipTemplateSol
  }, function () {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function () {
      status.textContent = '';
    }, 750);
  });
}

function reset_options() {
  var replaceCopy = false;
  var clipTemplate = getDefaultFormat();
  var clipTemplateSol = getDefaultFormatSol();
  document.getElementById('clipTemplate').value = clipTemplate;
  document.getElementById('clipTemplateSol').value = clipTemplateSol;
  document.getElementById('replaceCopy').checked = replaceCopy;
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  var statusText = "";
  chrome.storage.sync.get({
    replaceCopy: false,
    clipTemplate: "",
    clipTemplateSol: ""
  }, function (items) {
    if (items.clipTemplate != "") {
      document.getElementById('clipTemplate').value = items.clipTemplate;
    } else {
      document.getElementById('clipTemplate').value = '<span id="DefaultFormat"></span>' + getDefaultFormat();
      statusText = statusText + " KŞ tanımı kaydedilmemiş -- ";
    }
    if (items.clipTemplateSol != "") {
      document.getElementById('clipTemplateSol').value = items.clipTemplateSol;
    } else {
      document.getElementById('clipTemplateSol').value = '<span id="DefaultFormatSol"></span>' + getDefaultFormatSol();
      statusText = statusText + " KŞ Sol tanımı kaydedilmemiş";
    }


    //  document.getElementById('clipTemplate').value = items.clipTemplate;
    //  document.getElementById('clipTemplateSol').value = items.clipTemplateSol;

    document.getElementById('replaceCopy').checked = items.replaceCopy;
    var status = document.getElementById('status');
    status.textContent = statusText;

  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
  save_options);
document.getElementById('reset').addEventListener('click',
  reset_options);

