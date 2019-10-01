const Express = require("express")
const app = Express()
const port = 3000

const Datastore = require("nedb")
const tidigareAnnonser = new Datastore("tidigareAnnonser.db")

const hamtningarApi = require("./custom_modules/hamtningarApi")


tidigareAnnonser.loadDatabase()

app.use(Express.static("public"))
app.use(Express.json())

// för att spara annonser man hämtat tidigare så man kan hämta dem istället för genom API:n - tänk minicache


app.listen(port, () => {
    console.log(`Lyssnar genom port: ${port}`)
})

app.post("/annonsid", async (req, res) => {
    // för att ta emot annonsid
    console.log("mottaget")

    // !!! FÖRBÄTTRA VALIDERINGEN AV DET SOM tas emot!!!!

    // funktion för att ta emot annonsid
    const annonsId = req.body.annonsid
    if (arBaraNummer(annonsId)) {
        const annonsen = await hamtningarApi.redanHamtad(annonsId, tidigareAnnonser)
        if (annonsen["error"]) {
            console.log(annonsen["error"])
        }

        res.send(annonsen)

    } else {
        console.log(`*** Annonsid:t - ${annonsId} innehöll inte bara siffror ***`)
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