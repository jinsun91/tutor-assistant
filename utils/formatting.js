export function addCommas(number) {
    // Convert the number to a string with commas
    const formattedNumber = number.toLocaleString();
  
    // Remove any existing commas before adding new ones
    const numberWithCommas = formattedNumber.replace(/,/g, '');
  
    // Add commas every three digits using a regular expression
    const numberWithCommasFormatted = numberWithCommas.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
    return numberWithCommasFormatted;
}