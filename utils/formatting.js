export function addCommas(number) {
    // Convert the number to a string with commas
    const formattedNumber = number.toLocaleString();
  
    // Remove any existing commas before adding new ones
    const numberWithCommas = formattedNumber.replace(/,/g, '');
  
    // Add commas every three digits using a regular expression
    const numberWithCommasFormatted = numberWithCommas.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
    return numberWithCommasFormatted;
}

export function formatDateTime(hours, mins) {
    let formattedStr = "";
    if (hours > 0) {
        if (hours === 1) {
            formattedStr += "1 hr ";
        } else {
            formattedStr += hours + " hrs ";
        }
    }

    if (mins > 0) {
        formattedStr += mins + " mins"
    }

    return formattedStr;
}

export function calculateLessonIncome(rate, hours, mins) {
    let total = 0;
    total += rate * hours;
    total += rate * (mins / 60);

    if (total % 1 != 0) {
        total = total.toFixed(2);
    }

    return total;
}

export function formatIncome(number) {
    const decimalPart = number % 1;
  
    if (decimalPart === 0 && decimalPart.toFixed(2).slice(-2) === "00") {
        return Math.trunc(number);
    }
    return number;
}