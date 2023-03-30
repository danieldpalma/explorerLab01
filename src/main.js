import IMask from 'imask';
import './css/index.css';

const ccBgColor01 = document.querySelector(
  '.cc-bg svg > g g:nth-child(1) path'
);
const ccBgColor02 = document.querySelector(
  '.cc-bg svg > g g:nth-child(2) path'
);
const ccLogo = document.querySelector('.cc-logo span:nth-child(2) img');
function setCardType(type) {
  const colors = {
    visa: ['#00569F', '#FAA619'],
    mastercard: ['#CC0001', '#FE9900'],
    default: ['black', 'gray'],
  };
  ccBgColor01.setAttribute('fill', colors[type][0]);
  ccBgColor02.setAttribute('fill', colors[type][1]);
  ccLogo.setAttribute('src', `cc-${type}.svg`);
}

globalThis.setCardType = setCardType('default');

// CVC
const cvcInput = document.querySelector('#security-code');
let cvcMask = {
  mask: '0000',
};
let cvc = IMask(cvcInput, cvcMask);

// Expiration Date
const expirationDateInput = document.querySelector('#expiration-date');
let expirationDateMask = {
  mask: `MM{/}YY`,
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
};
let expirationDate = IMask(expirationDateInput, expirationDateMask);

// Card Number
/*
REGRAS DOS CARTÕES

Visa
  Inicia com 4, seguido de mais 15 dígitos

Mastercard
  Inicia com 5, seguido de um dígito entre 1 e 5, seguido de mais 2 dígitos
  OU
  Inicia com 22, seguido de um dígito entre 2 e 9, seguido de mais 1 dígitos
  OU
  Inicia com 2, seguido de um dígito entre 3 e 7, seguido de mais 3 dígitos
  seguido de mais 12 digitos
*/
const cardNumberInput = document.querySelector('#card-number');
const cardNumberMask = {
  mask: [
    {
      mask: '0000 0000 0000 0000',
      regex: /^4\d{0,15}/,
      cardType: 'visa',
    },
    {
      mask: '0000 0000 0000 0000',
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: 'mastercard',
    },
    {
      mask: '0000 0000 0000 0000',
      cardType: 'default',
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, '');
    const foundMask = dynamicMasked.compiledMasks.find(({ regex }) =>
      number.match(regex)
    );
    return foundMask;
  },
};
const cardNumber = IMask(cardNumberInput, cardNumberMask);

// Button
const addButton = document.querySelector('#add-card');
addButton.addEventListener('click', (e) => {
  e.preventDefault();
});

// Name's Card
const cardHolder = document.querySelector('#card-holder');
cardHolder.addEventListener('input', (e) => {
  const ccHolder = document.querySelector('.cc-holder .value');
  ccHolder.innerText =
    cardHolder.value.length === 0 ? 'FULANO DA SILVA' : cardHolder.value;
});

const updateSecurityCode = (code) => {
  const ccSecurity = document.querySelector('.cc-security .value');
  ccSecurity.innerText = code.length === 0 ? '123' : code;
};

cvc.on('accept', () => {
  updateSecurityCode(cvc.value);
});

cardNumber.on('accept', () => {
  const cardType = cardNumber.masked.currentMask.cardType;
  setCardType(cardType);
  updateCardNumber(cardNumber.value);
});

const updateCardNumber = (number) => {
  const ccNumber = document.querySelector('.cc-number');
  ccNumber.innerText = number.length === 0 ? '1234 5678 9012 3456' : number;
};

expirationDate.on('accept', () => {
  updateExpirationDate(expirationDate.value);
});

const updateExpirationDate = (date) => {
  const ccExpiration = document.querySelector('.cc-extra .value');
  ccExpiration.innerText = date.length === 0 ? '02/32' : date;
};
