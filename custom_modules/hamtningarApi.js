// hämtningar
const fetch = require("node-fetch")

require("dotenv").config()
const api_key = process.env.AF_API_KEY

// mer info om API:t här; https://jobsearch.api.jobtechdev.se/"

async function hamtaAnnons(annons, tidigareAnnonser) {

    //TODO: finns både officiellt id och internt id - är oklart om man kommer kunna söka på det officiella. Kan inte kolla det då dokumentationssidan ligger nere 2019-10-08
    const url = `https://jobsearch.api.jobtechdev.se/ad/${annons}`
    const options = {
        headers: {
            "api-key": api_key
        }
    }
    const data = await fetch(url, options)
    const json = await data.json()
    if (json.message) {
        // oklart vilka former av meddelanden som kan skickas från API:n
        if (json.message.includes("Ad not found")) {
            const errMsg = `\tAnnonsen med id - ${annons} - kan inte hittas`

            return {
                error: errMsg
            }
        }
    } else {
        //TODO: ändra till inject?
        const {
            hamtaEnskildaAnnonsOrd,
            rensaAnnonsen
        } = require("../custom_modules/bearbetning")

        const annonsPostBearbetad = {
            annonsId: annons,
            timestamp: Date.now(),
            annonsen: rensaAnnonsen(json),
            enskildaAnnonsOrd: hamtaEnskildaAnnonsOrd(json.description.text)
        }

        tidigareAnnonser.insert(annonsPostBearbetad)
        return annonsPostBearbetad
    }
}

function redanHamtad(annons, tidigareAnnonser) {

    return new Promise((resolve, reject) => {
        tidigareAnnonser.find({
            annonsId: annons
        }, async (err, data) => {
            let annonsen;
            if (err) {
                console.log(err)
            } else if (data.length !== 0) {
                console.log("\tAnnonsen har redan hämtats en gång och tas därför ur databasen...")
                annonsen = await data[0]
            } else {
                console.log("\tAnnonsen finns inte sparad, därför hämtas och sparas den från Arbetsförmedlingen...")
                annonsen = await hamtaAnnons(annons, tidigareAnnonser)
            }

            resolve(annonsen)

        })
    })
}
module.exports = {
    redanHamtad
}