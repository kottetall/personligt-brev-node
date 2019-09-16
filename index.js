const Datastore = require("nedb")
const fetch = require("node-fetch")
const Express = require("express")
const app = Express()
const port = 3000

require("dotenv").config() //hämtar ev env.variabler som används - ex api-nycklar. Se coding train 3.4

// för att hämta tar man process.env.<NAMN>
const api_key = process.env.API_KEY //nyckel för AF:s tjänster

// mer info om API:t här; https://jobsearch.api.jobtechdev.se/
// nya vägen är https://jobsearch.api.jobtechdev.se/ad/<ANNONSID> med nyckeln som header: "api-key:<NYCKEL>"


app.use(Express.static("public"))
app.use(Express.json())

// för att spara annonser man hämtat tidigare så man kan hämta dem istället för genom API:n - tänk minicache
const tidigareAnnonser = new Datastore("tidigareAnnonser.db")
tidigareAnnonser.loadDatabase()

app.listen(port, () => {
    console.log(`Lyssnar genom port: ${port}`)
})

app.post("/annons", (req, res) => {
    // för att ta emot annonsid


    // !!! FÖRBÄTTRA VALIDERINGEN AV DET SOM SKICKAS!!!!

    // funktion för att ta emot annonsid
    const testannons = req.body.annonsid

    if (arBaraNummer(testannons)) {
        redanHamtad(testannons, res)
    } else {
        console.log(`*** Annonsid:t - ${testannons} innehöll inte bara siffror ***`)
        res.send({
            "meddelande": "Ange bara siffror"
        })
    }
})

//FUNKTIONER SOM SKA FLYTTAS TILL EGNA FILER 

function arBaraNummer(nummer) {
    //kollar om strängen enbart innehåller "nummer" genom att skicka "falskt" om den hittar något som inte är ett nummer
    const regex = /\D/
    return !regex.test(nummer)
}

function redanHamtad(annons, res) {

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
            console.log("\tAnnonsen finns inte, därför hämtas den och sparas...")
            annonsen = await hamtaAnnons(annons)
        }

        // skickas till klienten
        res.send(annonsen)

    })
}

async function hamtaAnnons(annons) {

    // const url = `https://api.arbetsformedlingen.se/af/v0/platsannonser/${annons}` //gamla API:n
    const url = `https://jobsearch.api.jobtechdev.se/ad/${annons}`
    const options = {
        headers: {
            "api-key": api_key
        }
    }
    const data = await fetch(url, options)
    const json = await data.json()
    if (json.message !== "Platsannons saknas") {
        tidigareAnnonser.insert({
            annonsId: annons,
            timestamp: Date.now(),
            annonsen: json
        })
    }
    return json
}