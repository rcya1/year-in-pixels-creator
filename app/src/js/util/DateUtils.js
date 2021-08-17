export let getOrdinalEnding = function(number) {
    let i = number % 10;
    let k = number % 100;
    
    if(i === 1 && k !== 11) {
        return "st";
    }
    if(i === 2 && k !== 12) {
        return "nd";
    }
    if(i === 3 && k !== 13) {
        return "rd";
    }
    return "th";
}

export let getIndex = function(month, day) {
    return month * 31 + day;
}

export let isLeapYear = function(year) {
    let y = parseInt(year);
    if(y % 400 === 0) {
        return true;
    }
    if(year % 100 === 0) {
        return false;
    }
    if(year % 4 === 0) {
        return true;
    }
    return false;
}

export let getDayOfWeek = function(month, day, year) {
    let date = new Date(year, month, day, 12, 0, 0, 0);
    return date.getDay();
}
