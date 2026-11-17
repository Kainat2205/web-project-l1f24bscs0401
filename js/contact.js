// Assignment 2: DOM selection, events, live validation and show/hide feedback.
// This demonstration never sends or stores the form's contents.
const enquiryForm = document.getElementById('enquiry-form');
const enquiryResult = document.getElementById('enquiry-result');
const messageField = document.getElementById('contact-message');
const messageCount = document.getElementById('message-count');
const enquiryFields = Array.from(enquiryForm.querySelectorAll('[required]'));

function validateField(field) {
    let errorMessage = '';
    const value = field.value.trim();

    if (value === '') {
        errorMessage = 'Please complete this field.';
    } else if (field.type === 'email' && field.validity.typeMismatch) {
        errorMessage = 'Enter a valid email address, such as you@example.com.';
    } else if (field.minLength > 0 && value.length < field.minLength) {
        errorMessage = 'Please enter at least ' + field.minLength + ' characters.';
    } else if (field.maxLength > 0 && value.length > field.maxLength) {
        errorMessage = 'Please use no more than ' + field.maxLength + ' characters.';
    }

    document.getElementById(field.id + '-error').textContent = errorMessage;
    field.setAttribute('aria-invalid', String(errorMessage !== ''));
    return errorMessage === '';
}

function updateMessageCount() {
    messageCount.textContent = messageField.value.length + ' / 1000';
}

enquiryFields.forEach(function (field) {
    field.addEventListener('blur', function () {
        validateField(field);
    });

    field.addEventListener('input', function () {
        enquiryResult.hidden = true;
        // After an error appears, update it as the visitor corrects their entry.
        if (field.hasAttribute('aria-invalid')) {
            validateField(field);
        }
    });

    field.addEventListener('change', function () {
        enquiryResult.hidden = true;
        validateField(field);
    });
});

messageField.addEventListener('input', updateMessageCount);

enquiryForm.addEventListener('submit', function (event) {
    event.preventDefault();
    enquiryResult.hidden = true;
    let firstInvalidField = null;

    enquiryFields.forEach(function (field) {
        if (!validateField(field) && firstInvalidField === null) {
            firstInvalidField = field;
        }
    });

    if (firstInvalidField !== null) {
        firstInvalidField.focus();
        return;
    }

    enquiryResult.hidden = false;
    enquiryResult.focus();
});

enquiryForm.addEventListener('reset', function () {
    enquiryResult.hidden = true;
    enquiryFields.forEach(function (field) {
        field.removeAttribute('aria-invalid');
        document.getElementById(field.id + '-error').textContent = '';
    });
    // Reset restores the textarea's initial content, even in a background tab.
    messageCount.textContent = messageField.defaultValue.length + ' / 1000';
});

// Use the accessible inline messages above once JavaScript is ready.
enquiryForm.noValidate = true;
document.getElementById('enquiry-submit').disabled = false;
updateMessageCount();
