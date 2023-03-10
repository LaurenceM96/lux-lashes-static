// input elements
const contactMethod = document.getElementById('contact-method');
const contactInput = document.getElementById('contact-details');
const contactInputLabel = document.getElementById('contact-details-label');
const nameInput = document.getElementById('name');
const dateInput = document.getElementById('date');
const infoInput = document.getElementById('questions');

// Error div elements
const dateErrorDiv = document.getElementById('date-error');
const contactDetailsErrorDiv = document.getElementById('contact-details-error');
const nameErrorDiv = document.getElementById('name-error');
const treatmentsErrorDiv = document.getElementById('treatments-error');

// Multi select elements
const selectBtn = document.getElementById('select-btn');
const listItems = document.getElementById('list-items');
const items = document.getElementsByClassName('li-item');

// Detect ios safari
var ua = window.navigator.userAgent;
var iPad = ua.match(/iPad/i);
var iPhone = ua.match(/iPhone/i);
var webkit = ua.match(/WebKit/i);
var iPhoneSafari = iPhone && webkit && !ua.match(/CriOS/i);
var iPadSafari = iPad && webkit && !ua.match(/CriOS/i);

eventType = "click";

if (iPhoneSafari) {
    eventType = "click touchend";
}

if (iPadSafari) {
    eventType = "touchstart";
}

// Multi select logic
let moved = 0;
window.addEventListener('touchstart', function() {
    moved = 0;
});

window.addEventListener('touchmove', function() {
    moved = 1;
});

"click".split(" ").forEach(function(e){
    window.addEventListener(e, function(e) {
        if (moved === 0) {
            if (selectBtn.contains(e.target)){
                selectBtn.classList.toggle('open');
            } else {
                if (!listItems.contains(e.target) && selectBtn.classList.contains('open')) {
                    selectBtn.classList.toggle('open');
                }
            }
        }
    });
});

Array.from(items).forEach(element => {
    element.addEventListener('click', function() {
        if (moved === 0) {
            element.classList.toggle('checked');

            let checked = document.getElementsByClassName('checked');
            let btnText = document.getElementById('btn-text');

            if (checked && checked.length > 0) {
                btnText.innerHTML = checked.length + ' treatment(s) selected';
            } else {
                btnText.innerHTML = 'Select treatment(s)';
            }
        }
    });
    
});


// On contact method changing, update contact details input label and placeholder
contactMethod.addEventListener('change', function() {
    // Get the selected option value
    const selectedValue = this.options[this.selectedIndex].value;

    // Set the input placeholder based on the selected option value
    if (selectedValue === 'email') {
        contactInput.placeholder = 'Email';
        contactInputLabel.innerHTML = 'Email:';
        contactInput.type = 'email';
    } else if (selectedValue === 'phone') {
        contactInput.placeholder = 'Phone Number';
        contactInputLabel.innerHTML = 'Phone Number:';
        contactInput.type = 'text';
    }
    contactDetailsErrorDiv.innerHTML = '';
    contactDetailsErrorDiv.style.display = 'none';
    contactInput.classList.remove('error');
    contactInput.value = '';
});

// Validate date, Weekdays, 8-5
const validateDate = dateString => {
    if (dateString.length === 0) {
        return false;
    }
    const day = (new Date(dateString)).getDay();
    const hour = (new Date(dateString)).getHours();
    if (day===0 || day===6) {
        return false;
    }
    if (hour < 8 || hour > 16) {
        return false;
    }
    return true;
}

// Validate name (make sure its not empty)
const validateName = () => {
    return !(nameInput.value.length === 0);
}

// Validate contact details
const validateContactDetails = () => {
    if (contactInput.value.length === 0) {
        return false;
    }

    if (contactMethod.value === 'email') {
        if (!contactInput.validity.valid) {
            return false;
        }
    }

    if (contactMethod.value === 'phone') {
        if (contactInput.value.length != 11 || contactInput.value.substring(0,2) != '07') {
            return false;
        }
    }

    return true;
}

// Date validation on change
document.getElementById('date').addEventListener('change', function(evt) {
    if (!validateDate(evt.target.value)) {
        evt.target.value = '';
        dateErrorDiv.innerHTML = 'Please enter a valid date and time';
        dateErrorDiv.style.display = 'inline-block';
        dateInput.classList.add('error');
    } else {
        dateErrorDiv.innerHTML = '';
        dateErrorDiv.style.display = 'none';
        dateInput.classList.remove('error');
    }
});

// Name validation on change
document.getElementById('name').addEventListener('change', function() {
    if (!validateName()) {
        nameErrorDiv.innerHTML = 'Please enter your name';
        nameErrorDiv.style.display = 'inline-block';
        nameInput.classList.add('error');
    } else {
        nameErrorDiv.innerHTML = '';
        nameErrorDiv.style.display = 'none';
        nameInput.classList.remove('error');
    }
});

// contact details validation on change
document.getElementById('contact-details').addEventListener('change', function() {
    if (!validateContactDetails()) {
        if (contactMethod.value === 'email') {
            contactDetailsErrorDiv.innerHTML = 'Please enter a valid email address'
        }

        if (contactMethod.value === 'phone') {
            contactDetailsErrorDiv.innerHTML = 'Please enter a valid phone number'
        }
        contactDetailsErrorDiv.style.display = 'inline-block';
        contactInput.classList.add('error');
    } else {
        contactDetailsErrorDiv.innerHTML = '';
        contactDetailsErrorDiv.style.display = 'none';
        contactInput.classList.remove('error');
    }
});

// Validate inputs and send email to vendor with enquiry details
const validateAndSubmitToAPI = evt => {
    evt.preventDefault();
    var url = "https://26je0jg1ab.execute-api.eu-west-2.amazonaws.com/prod/enquire";
    let isValid = true;
    let scrollToElement = nameInput;

    let checkedTreatments = document.getElementsByClassName('checked');

    console.log(checkedTreatments);
    if (!checkedTreatments || checkedTreatments.length === 0) {
        isValid = false;
        treatmentsErrorDiv.innerHTML = 'Please select at least 1 treatment'
        treatmentsErrorDiv.style.display = 'inline-block';
        selectBtn.classList.add('error');
        scrollToElement = selectBtn;
    }

    if (!validateDate(document.getElementById('date').value)) {
        isValid = false;
        dateErrorDiv.innerHTML = 'Please enter a date and time';
        dateErrorDiv.style.display = 'inline-block';
        dateInput.classList.add('error');
        scrollToElement = dateInput;
    }

    if (!validateContactDetails()) {
        isValid = false;
        if (contactMethod.value === 'email') {
            contactDetailsErrorDiv.innerHTML = 'Please enter a valid email address'
        }

        if (contactMethod.value === 'phone') {
            contactDetailsErrorDiv.innerHTML = 'Please enter a valid phone number'
        }
        contactDetailsErrorDiv.style.display = 'inline-block';
        contactInput.classList.add('error');
        scrollToElement = contactInput;
    }

    if (!validateName()) {
        isValid = false;
        nameErrorDiv.innerHTML = 'Please enter your name';
        nameErrorDiv.style.display = 'inline-block';
        nameInput.classList.add('error');
        scrollToElement = nameInput;
    }

    if (!isValid) {
        scrollToElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return false;
    }

    var name = nameInput.value;
    var contact = contactInput.value;
    var date = dateInput.value;
    var treatments = Array.from(checkedTreatments).map(function(element) {
        return element.children[1].innerHTML;
    });
    var info = infoInput.value;

    var data = {
        name : name,
        contact : contact,
        date : date,
        treatments : treatments,
        info : info
    };

    const formElement = document.getElementById('enquiry-form');
    const containerElement = document.getElementById('form-container');

    var currentContentHeight = containerElement.offsetHeight;
    containerElement.style.height = currentContentHeight + "px";
    containerElement.style.justifyContent = "flex-start";

    const loadingElement = document.createElement("h2");
    const loadingText = document.createTextNode("Sending enquiry...");
    loadingElement.appendChild(loadingText);
    loadingElement.style.marginTop = "50px";

    formElement.remove();
    containerElement.appendChild(loadingElement);

    window.scrollTo(0, 0);



    fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(data)
    }).then((response) => {
        console.log(response.text);
        if (response.ok) {
          loadingElement.textContent = "Enquiry sent!";
          const homeButton = document.createElement("a");
          homeButton.setAttribute('class', "action-button");
          homeButton.setAttribute('href', "index.html");
          const homeButtonText = document.createTextNode("Click here to back to our home page");
          homeButton.appendChild(homeButtonText);
          containerElement.appendChild(homeButton);
        } else {
            throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        console.log(error);
        loadingElement.textContent = "Oops, something went wrong!";
      });
}