const Datastore = require("nedb")
const fetch = require("node-fetch")
const Express = require("express")
const app = Express()
const port = 3000

require("dotenv").config() //hämtar ev env.variabler som används - ex api-nycklar. Se coding train 3.4

// för att hämta tar man process.env.<NAMN>
const api_key = process.env.API_KEY
console.log(api_key)


let tid = Date.now()

const testData = {
    meddelande: "gick bra",
    tid: tid
}






// !!!! TESTDATABAS !!!!
const databas = new Datastore("databas.db")
databas.loadDatabase() // laddar in filen och skapar den om den inte redan finns
databas.insert(testData) // lägger in data i databasen, JSON
databas.find({}, (err, data) => {
    // console.log(data)
}) // hämtar allt när {} är tomt, man kan lägga in olika sökkriterier. Gås igenom lite på coding train 2.4
// !!!! TESTDATABAS !!!!

// för att spara annonser man hämtat tidigare så man kan hämta dem istället för genom API:n - tänk minicache
const tidigareAnnonser = new Datastore("tidigareAnnonser.db")
tidigareAnnonser.loadDatabase()

app.listen(port, () => {
    console.log(`Lyssnar genom port: ${port}`)
})
app.use(Express.static("public"))

// testgrej för att se så server och sida kan prata med varandra - klient "hämtar" meddelandet
app.get("/test", (req, res) => {
    res.send(testData)
    // res.json(testData) //oklart vilken som gäller, json används av codingtrain
})

//FUNKTIONER SOM SKA FLYTTAS TILL EGNA FILER 

function redanHamtad(annons) {
    tidigareAnnonser.find({
        annonsId: annons
    }, async (err, data) => {
        let annonsen;
        if (err) {
            console.log(err)
        } else if (data.length !== 0) {
            console.log("\tAnnonsen har redan hämtats en gång och tas därför ur databasen...")
            annonsen = data[0].annonsen
        } else {
            console.log("\tAnnonsen finns inte, därför hämtas den och sparas...")
            annonsen = await hamtaAnnons(annons)
        }

        // "annonsen" skickas sedan till klienten
        // console.log(annonsen)
    })
}


async function hamtaAnnons(annons) {

    const url = `https://api.arbetsformedlingen.se/af/v0/platsannonser/${annons}`
    const data = await fetch(url)
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

//FUNKTIONER SOM SKA FLYTTAS TILL EGNA FILER 


const testannons = "8448916"
// const testannons = "7448916" //test av felaktigt nummer

redanHamtad(testannons)

//TESTKÖRNINGAR