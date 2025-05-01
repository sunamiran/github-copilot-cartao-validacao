const prompt = require('prompt-sync')();
/**
 * Validates a credit card number and detects its "bandeira" (brand) based on the rules in base.png and additional brands.
 * @param {string} cardNumber - The credit card number as a string.
 * @returns {{ valid: boolean, bandeira: string|null }} - Validation result and detected "bandeira".
 */
function validateCreditCard(cardNumber) {
    const sanitized = cardNumber.replace(/\D/g, '');

    // Luhn Algorithm for card validation
    function luhnCheck(num) {
        let sum = 0;
        let shouldDouble = false;
        for (let i = num.length - 1; i >= 0; i--) {
            let digit = parseInt(num.charAt(i), 10);
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        return sum % 10 === 0;
    }

    // Bandeira detection (based on base.png + extras)
   // Bandeira detection (base real de BINs, com melhorias)
let bandeira = null;

if (/^4/.test(sanitized)) bandeira = 'Visa';
else if (/^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(sanitized)) bandeira = 'MasterCard';
else if (/^(4011|4312|4389|4576|5066|509|6277|6362)/.test(sanitized)) bandeira = 'Elo';
else if (/^(34|37)/.test(sanitized)) bandeira = 'American Express';
else if (/^(6011|65|64[4-9])/.test(sanitized)) bandeira = 'Discover';
else if (/^(606282|3841)/.test(sanitized)) bandeira = 'Hipercard';
else if (/^(300|301|302|303|304|305|36|38)/.test(sanitized)) bandeira = 'Diners Club';
else if (/^(2014|2149)/.test(sanitized)) bandeira = 'EnRoute';
else if (/^35/.test(sanitized)) bandeira = 'JCB';
else if (/^50/.test(sanitized)) bandeira = 'Aura';
else if (/^8699/.test(sanitized)) bandeira = 'Voyager';

    return {
        valid: luhnCheck(sanitized),
        bandeira
    };
}

// User input
const input = prompt('Digite o número do cartão: ');
const result = validateCreditCard(input);

if (result.valid && result.bandeira) {
    console.log(`✅ Cartão válido da bandeira: ${result.bandeira}`);
} else if (!result.valid) {
    console.log('❌ Cartão inválido!');
} else {
    console.log('⚠️ Cartão válido, mas bandeira não reconhecida.');
}