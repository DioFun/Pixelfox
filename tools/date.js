const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const TStoDate = (TS, hour = true) => {
    let timestamp = new Date(TS);

    let date = `${timestamp.getDate()} ${months[timestamp.getMonth()]} ${timestamp.getFullYear()} ${hour ? `à ${timestamp.getHours() < 10 ? "0" + timestamp.getHours() : timestamp.getHours()}H${timestamp.getMinutes() < 10 ? "0" + timestamp.getMinutes() : timestamp.getMinutes()}` : ``}`;

    return date;
}

const TStoShortDate = (TS, hour = true) => {
    let timestamp = new Date(TS);

    let date = `${timestamp.getDate() < 10 ? "0" + timestamp.getDate() : timestamp.getDate()}/${timestamp.getMonth()+1 < 10 ? "0" + (timestamp.getMonth()+1) : (timestamp.getMonth()+1)}/${timestamp.getFullYear()} ${hour ? `à ${timestamp.getHours() < 10 ? "0" + timestamp.getHours() : timestamp.getHours()}H${timestamp.getMinutes() < 10 ? "0" + timestamp.getMinutes() : timestamp.getMinutes()}` : ``}`;

    return date;
}

const StrToTime = (string) => {
    // MSJH
    if (!string) throw "Aucune durée spécifiée";
    let month = string.split("M")
    if (month.length <= 1) { month = 0 } else {string = month[1], month = month[0]; }
    let week = string.toLowerCase().split("s")
    if (week.length <= 1) { week = 0 } else {string = week[1]; week = week[0];}
    let day = string.toLowerCase().split("j")
    if (day.length <= 1) { day = 0 } else {string = day[1]; day = day[0];}
    let hours = string.toLowerCase().split("h")
    if (hours.length <= 1) { hours = 0 } else {string = hours[1], hours = hours[0];}
    let mins = string.split("m")
    if (mins.length <= 1) { mins = 0 } else {string = mins[1], mins = mins[0]; }
    
    let totalTime = (month*2592000)+(week*604800)+(day*86400)+(hours*3600)+(mins*60);

    if (isNaN(totalTime)) throw "Durée invalide !";
    return totalTime*1000;

}

module.exports = {
    TStoDate,
    TStoShortDate,
    StrToTime
}
