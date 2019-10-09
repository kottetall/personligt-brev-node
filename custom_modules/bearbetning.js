function hamtaEnskildaAnnonsOrd(annonsbeskrivning) {
    const splitRegEx = /[^A-ö]+/g
    const enskildaOrd = {}

    annonsbeskrivning
        .toLowerCase()
        .split(splitRegEx)
        .forEach(ord => {
            enskildaOrd[ord] = true
        });

    return Object
        .keys(enskildaOrd)
        .sort((a, b) => a.localeCompare(b)) //enl mdn finns en mer effektiv funktion

    //FIXME: Sorteringen funkar inte som den ska. om man bara har .sort fallerar ett test och har man bara .localeCOmpare fallerar ett annat. Hjälper inte att kedja båda
}

function rensaAnnonsen(hamtadAnnons) {
    return {
        id,
        external_id,
        webpage_url,
        headline,
        application_deadline,
        description,
        employer,
        application_details,
        occupation,
        workplace_address,
        must_have,
        nice_to_have,
        publication_date,
        last_publication_date
    } = hamtadAnnons
}

module.exports = {
    hamtaEnskildaAnnonsOrd,
    rensaAnnonsen
}