// global variables
const $form = $('form');
const $title = $('#title');
const $design = $('#design');
const $color = $('#color');
const $activities = $('.activities');
const $activityLabels = $('.activities label');
const $payment = $('#payment');
const $creditcard = $('#credit-card');
const $paypal = $('p:contains("Paypal")')[0].parentNode;
const $bitcoin = $('p:contains("Bitcoin")')[0].parentNode;
let selectedPayment = '';

let total = 0;

const clearColorOptions = () => {
  $('#color option[value="cornflowerblue"]').remove();
  $('#color option[value="darkslategrey"]').remove();
  $('#color option[value="gold"]').remove();
  $('#color option[value="tomato"]').remove();
  $('#color option[value="steelblue"]').remove();
  $('#color option[value="dimgrey"]').remove();
  $('#color option[value="selecttheme"]').remove();
}

const setupColorSelection = (event) => {
  const design = event.target.value;

  clearColorOptions();
  $('#colors-js-puns').show();
  if (design === 'js puns') {
    $color.append('<option value="cornflowerblue">Cornflower Blue</option>');
    $color.append('<option value="darkslategrey">Dark Slate Grey</option>');
    $color.append('<option value="gold">Gold</option>');
  } else if (design === 'heart js') {
    $color.append('<option value="cornflowerblue">Tomato</option>');
    $color.append('<option value="darkslategrey">Steel Blue</option>');
    $color.append('<option value="gold">Dim Grey</option>');
  } else {
    $('#colors-js-puns').hide();
  }
}

// get schedule of checked
const getSchedule = (label) => {
  const checkedText = label.textContent;
  const startIndex = checkedText.indexOf(' — ') + 3;
  const endIndex = checkedText.indexOf(',');
  let schedule = '';

  if ((startIndex + 1) && (endIndex + 1)) {
    schedule = checkedText.slice(startIndex, endIndex);
  }
  return schedule;
}

// enable/disable checkboxes based on user's schedule preferences
const validateCheckboxes = (checkedBox) => {
  const checked = checkedBox.checked;
  const label = checkedBox.parentNode;
  const index = $(label).index() - 1;
  const schedule = getSchedule(label);

  if(!schedule) {
    return;
  }

  for (let i = 0; i < $activityLabels.length; i++) {
    let activityText = $activityLabels[i].textContent;

    if (i === index) {
      continue;
    } else if (activityText.indexOf(schedule) + 1) {
        const $checkbox = $($activityLabels[i]).children()[0];

        if (checked) {
          $($checkbox).prop('disabled', true);
          $($activityLabels[i]).css('color', 'grey');
        } else {
          $($checkbox).prop('disabled', false);
          $($activityLabels[i]).css('color', '');
        }
    }
  }
}

const computeTotal = (checkedBox) => {
  const checked = checkedBox.checked;
  const label = checkedBox.parentNode;
  const checkedText = label.textContent;
  const startIndex = checkedText.indexOf('$') + 1;
  const price = checkedText.slice(startIndex);

  if (checked) {
    total += parseInt(price);
  } else {
    total -= parseInt(price);
  }

  $('#total').remove();
  if (total > 0) {
    $($activities).last().append(`<h4 id='total'>Total: $${total}</h4>`);
  }
}

const showHidePayment = () => {
  $creditcard.hide();
  $($paypal).hide();
  $($bitcoin).hide();

  if (selectedPayment === 'credit card') {
    $creditcard.show();
  } else if (selectedPayment === 'paypal') {
    $($paypal).show();
  } else if (selectedPayment === 'bitcoin') {
    $($bitcoin).show();
  }
}

const nameIsEmpty = () => {
  let isEmpty = false;
  const $name = $('#name')[0];

  if ($name.value.trim() === '') {
    isEmpty = true
    $($name).prev()
      .append('<br class="error"><div style="color:red;margin-left:5px;font-size:.9rem;" class="error">(please provide your name)</div>');
  }
  return isEmpty;
}

const emailIsInvalid = () => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const mail = $('#mail')[0].value.trim();
  const isInvalid = !re.test(String(mail).toLowerCase());

  $('.email-error').remove();
  if (mail.length === 0) {
    $('#mail').prev()
      .append('<br class="email-error"><div style="color:red;margin-left:5px;font-size:.9rem;" class="email-error">(please provide your email address)</div>');
  } else if (isInvalid) {
    $('#mail').prev()
      .append('<br class="email-error"><div style="color:red;margin-left:5px;font-size:.9rem;" class="email-error">(please provide a valid email address)</div>');
  }
  return isInvalid;
}

const designNotSelected = () => {
  let notSelected = false;

  if ($design[0].value === 'Select Theme') {
    notSelected = true;
    $('.shirt legend')
      .append($('<br class="error"><div style="color:red;margin-left:5px;font-size:.9rem;" class="error">(don\'t forget to pick a T-shirt)</div>'));
  }
  return notSelected;
}

const noSelectedCheckbox = () => {
  let noSelected = false;
  if ($('.activities input:checked').length === 0) {
    noSelected = true;
    $('.activities legend')
      .append($('<br class="error"><div style="color:red;margin-left:5px;font-size:.9rem;" class="error">(please check at least one activity)</div>'));
  }
  return noSelected;
}

const creditCardIsInvalid = () => {
  const ccNum = $('#cc-num')[0].value.trim();
  const zip = $('#zip')[0].value.trim();
  const cvv = $('#cvv')[0].value.trim();
  const re = /^\d+$/;
  let invalid = false;

  $('.cc-error').remove();

  // card must be a 13 to 16 digit number
  if (ccNum.length === 0) {
    invalid = true;
    $('#cc-num').prev()
      .append($('<br class="cc-error"><div style="color:red;margin-left:5px;font-size:.9rem;" class="cc-error">(enter card number)</div>'));
  } else if (ccNum.length < 13 || ccNum.length > 16 || !re.test(ccNum)) {
    invalid = true;
    $('#cc-num').prev()
      .append($('<br class="cc-error"><div style="color:red;margin-left:5px;font-size:.9rem;" class="cc-error">(13 to 16 digit number)</div>'));
  } else {
    $('#cc-num').prev()
      .append($('<br class="cc-error"><div style="font-size:.9rem;" class="cc-error">&nbsp</div>'));
  }

  // zip must be a 5 digit number
  if (zip.length === 0) {
    invalid = true;
    $('#zip').prev()
      .append($('<br class="cc-error"><div style="color:red;margin-left:5px;font-size:.9rem;" class="cc-error">(enter zip code)</div>'));
  } else if (zip.length !== 5 || !re.test(zip)) {
    invalid = true;
    $('#zip').prev()
      .append($('<br class="cc-error"><div style="color:red;margin-left:5px;font-size:.9rem;" class="cc-error">(5 digit number)</div>'));
  } else {
    $('#zip').prev()
      .append($('<br class="cc-error"><div style="font-size:.9rem;" class="cc-error">&nbsp</div>'));
  }

  // cvv must be a 3 digit number
  if (cvv.length === 0) {
    invalid = true
    $('#cvv').prev()
      .append($('<br class="cc-error"><div style="color:red;margin-left:5px;font-size:.9rem;" class="cc-error">(enter enter CVV)</div>'));
  } else if (cvv.length !== 3 || !re.test(cvv)) {
    invalid = true
    $('#cvv').prev()
      .append($('<br class="cc-error"><div style="color:red;margin-left:5px;font-size:.9rem;" class="cc-error">(3 digit number)</div>'));
  } else {
    $('#cvv').prev()
      .append($('<br class="cc-error"><div style="font-size:.9rem;" class="cc-error">&nbsp</div>'));
  }

  if(!invalid) {
    $('.cc-error').remove();
  }

  return invalid;
}

const validateForm = (event) => {
  $('.error').remove();

  let hasError = false;

  hasError = nameIsEmpty();
  hasError = emailIsInvalid() || hasError;
  hasError = designNotSelected() || hasError;
  hasError = noSelectedCheckbox() || hasError

  if (selectedPayment === 'credit card') {
    hasError = creditCardIsInvalid() || hasError;
  }

  if (hasError) {
    event.preventDefault();
    window.scrollTo(0, 0);
  }
}

const addEvents = () => {

  // on job title change, show/hide other title text field
  $title.on('change', (event) => {
    const title = event.target.value;
    if (title === 'other') {
      $('#other-title').show();
    } else {
      $('#other-title').hide();
    }
  });

  // depending on selected design, show/hide colors
  $design.on('change', (event) => {
    setupColorSelection(event);
  });

  // activities-related event
  $activities.on('change', (event) => {
    validateCheckboxes(event.target);
    computeTotal(event.target);
  });

  // payment option-related event
  $payment.on('change', (event) => {
    selectedPayment = event.target.value;
    showHidePayment();
  });

  // validation events
  $form.on('submit', (event) => {
    validateForm(event);
  });

  $('#mail').on('change', () => {
    emailIsInvalid();
  });
}

const initializeForm = () => {
  // focus on the first field on page load
  $('#name').focus();
  // other is not initially selected so hide
  $('#other-title').hide();
  // color selection related stuff
  $('#colors-js-puns').hide();

  // select Credit Card payment option by default
  selectedPayment = 'credit card';
  $payment.val(selectedPayment);
  $($paypal).hide();
  $($bitcoin).hide();

  addEvents();
}

$(document).on('DOMContentLoaded', () => {
  initializeForm();
});
