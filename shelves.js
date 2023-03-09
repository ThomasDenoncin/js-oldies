var user = "01234"
var pressed = false
var chars = []
var collection = {}

var initModal = function() {
  document.querySelector('.modal-close').addEventListener('click', closeModal);
}

var closeModal = function() {
  document.querySelector('.modal-block').classList.toggle('hidden');
  document.querySelector('.modal-message').innerHTML = "";
}

var displayModal = function(message) {
  document.querySelector('.modal-message').innerHTML = message;
  if (document.querySelector('.modal-block').classList.contains('hidden')) {
    document.querySelector('.modal-block').classList.toggle('hidden');
  }
}

var displayProduct = function(product) {
  var node = document.querySelector('.product').cloneNode(true)
  node.querySelector('.product-id').innerHTML = product.id +'\n'
  loadProduct(product,node)
}

var loadProduct = function(product,node) {
  var req = new XMLHttpRequest()
  req.open('GET', 'http://display.wtf/API/?type=product&code=' + product.id, true)
  req.onreadystatechange = function (aEvt) {
    if (req.readyState == 4) {
       if(req.status == 200)
        console.log(req.responseText)
       else
        console.log("Erreur pendant le chargement de la page.\n")
    }
  }
  req.send(null)
}

var checkBarcode = function(e) {
    if (e.which >= 48 && e.which <= 57) {
        chars.push(String.fromCharCode(e.which))
    }
    if (pressed == false) {
        pressed = true
        to = setTimeout( function() {
            if (chars.length >= 10) {
                var barcode = chars.join("")
                console.log("Barcode Scanned: " + barcode)
                manageBarcode(barcode)
            }
            clearTimeout(to)
            chars = []
            pressed = false
        }, 300)
    }
}

var search = function() {
  manageBarcode(this.value);
}

var manageBarcode = function(barcode) {
  var message = "";
  if (barcode in collection) {
    message = barcode +" est dejà dans votre collection."
  } else {
    collection[barcode] = ""
    localStorage[user] = JSON.stringify(collection)
    var product = {'id':barcode}
    displayProduct(product);
    message = barcode +" a bien été ajouté à votre collection. Continuez à scanner pour ajouter d'autres produits."
  }
  displayModal(message);
};

/*var checkStorage = function() {
  try {
    var storage = window[localStorage],
		    x = '__storage_test__'
		storage.setItem(x, x)
		storage.removeItem(x)
		return true
	}
	catch(e) {
		return false
	}
}

var checkUser = function()  {
  if (checkStorage) {
    if(!localStorage.getItem(user)) {
      return false
    } else {
      return true
    }
  } else {
    console.log('no localStorage')
    return false
  }
}

var addUser = function() {
  if (checkStorage && !checkUser) {
    localStorage[user] = "";
  }
}*/

(function() {
    if (localStorage.getItem(user)) {
      collection = JSON.parse(localStorage[user])
    }
    window.addEventListener('keypress', checkBarcode);
    document.querySelector('.code').addEventListener('input', search);
    initModal();
})()
