const Express = require("express")
const app = Express()
const port = 3000

const Datastore = require("nedb")
const tidigareAnnonserDatabas = new Datastore("./databaser/tidigareAnnonser.db")
const anvandareDatabas = new Datastore("./databaser/anvandare.db")

const {
    redanHamtad
} = require("./custom_modules/hamtningarApi")

const {
    UserBase
} = require("./custom_modules/user")
const {
    arBaraNummer
} = require("./custom_modules/validering")


// databas
tidigareAnnonserDatabas.loadDatabase()
anvandareDatabas.loadDatabase()


// routing
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
        const annonsen = await redanHamtad(annonsId, tidigareAnnonserDatabas)
        if (annonsen["error"]) {
            console.log(annonsen["error"])
        }

        res.send(annonsen)

    } else {
        console.log(`*** Annonsid:t - "${annonsId}" innehöll inte bara siffror ***`)
        res.send({
            meddelande: "Ange bara siffror"
        })
    }
})


app.post("/ny", async (req, res) => {
    const {
        namn: anvandarNamn
    } = req.body
    console.log(`Lägga till ny användare med användarnamn: ${anvandarNamn}`)
    anvandareDatabas.find({
        "grunduppgifter.namn": anvandarNamn
    }, (err, docs) => {
        err ? console.log(err) : console.log(`\t*\tInga fel uppkom i databasen när namnet "${anvandarNamn}" kontrollerades`)

        // Kollar om användaren redan finns
        if (docs.length === 0) {
            // Om användaren inte finns
            // TODO: Kollar enbart efter dubletter av namn. Ändras till anv.namn eller mail 
            anvandarData = new UserBase(anvandarNamn)
            anvandareDatabas.insert(anvandarData, (err, newDoc) => {
                const msg = `\t*\tAnvändaren "${anvandarNamn}" har lagts till.`
                console.log(msg)
                res.send({
                    meddelande: msg.replace("\t\*\t", ""),
                    data: newDoc
                })
            })
        } else {
            // Om användaren finns
            const msg = `\t*\tDet finns redan en användare med namnet "${anvandarNamn}" och användaren har därför inte lagts till i databasen`
            console.log(msg)
            res.send({
                meddelande: msg.replace("\t\*\t", "")
            })
        }
    })
})

app.post("/uppdatera", async (req, res) => {



    // TODO: Just nu är det enbart namnet som ändras
    const {
        id,
        namn: nyttAnvandarNamn
    } = req.body

    console.log(`Uppdatera inloggad användares namn med: ${nyttAnvandarNamn}`)

    // hämtar användaren
    const anvandarData = await new Promise((resolve, reject) => {
        // TODO: Lägg till funktion att en ny användare sparas om man inte hittar någon
        anvandareDatabas.find({
            "_id": id
        }, (err, docs) => {
            if (err) {
                console.log(err)
            } else {
                resolve(docs[0])
            }
        })
    })

    //justerar användarens data
    const tidigareAnvandarNamn = anvandarData.grunduppgifter.namn
    anvandarData.grunduppgifter.namn = nyttAnvandarNamn

    //Ersätter den gamla datan med den nya i databasen
    anvandareDatabas.update({
        _id: id
    }, {
        $set: anvandarData
    })

    //För att snygga till filen, annars hamnar förändringen sist och allt komprimeras inte förrän man laddar om databasen
    anvandareDatabas.persistence.compactDatafile()

    //Bekräftelse
    const msg = `\t*\tNamnet "${tidigareAnvandarNamn}" har ändrats till "${nyttAnvandarNamn}"`
    console.log(msg)
    res.send({
        message: msg.replace("\t\*\t", "")
    })
})