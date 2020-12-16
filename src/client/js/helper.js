function validateTrip(locale, start, end){
    const trim_locale = locale.trim();
    if(trim_locale !== "" && start <= end){
    return true;
    }
    else{
    return false
    }
}

export { validateTrip }