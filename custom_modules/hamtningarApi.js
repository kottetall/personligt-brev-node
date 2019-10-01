// hämtningar
const fetch = require("node-fetch")

require("dotenv").config() //hämtar ev env.variabler som används - ex api-nycklar. Se coding train 3.4

// för att hämta tar man process.env.<NAMN>
const api_key = process.env.API_KEY //nyckel för AF:s tjänster

// mer info om API:t här; https://jobsearch.api.jobtechdev.se/
// nya vägen är https://jobsearch.api.jobtechdev.se/ad/<ANNONSID> med nyckeln som header: "api-key:<NYCKEL>"

async function hamtaAnnons(annons, tidigareAnnonser) {

    // const url = `https://api.arbetsformedlingen.se/af/v0/platsannonser/${annons}` //gamla API:n
    const url = `https://jobsearch.api.jobtechdev.se/ad/${annons}`
    const options = {
        headers: {
            "api-key": api_key
        }
    }
    const data = await fetch(url, options)
    const json = await data.json()
    if (json.message === "Ad not found") {
        const errMsg = `\tAnnonsen med id - ${annons} - kan inte hittas`

        return {
            error: errMsg
        }
    } else {
        tidigareAnnonser.insert({
            annonsId: annons,
            timestamp: Date.now(),
            annonsen: json
        })
        return json
    }
}

module.exports.redanHamtad = (annons, tidigareAnnonser) => {

    return new Promise((resolve, reject) => {
        tidigareAnnonser.find({
            annonsId: annons
        }, async (err, data) => {
            let annonsen;
            if (err) {
                console.log(err)
            } else if (data.length !== 0) {
                console.log("\tAnnonsen har redan hämtats en gång och tas därför ur databasen...")
                annonsen = await data[0].annonsen
            } else {
                console.log("\tAnnonsen finns inte, därför försöker den hämtas och sparas...")
                annonsen = await hamtaAnnons(annons, tidigareAnnonser)
            }

            resolve(annonsen)

        })
    })
}