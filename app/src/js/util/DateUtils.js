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
