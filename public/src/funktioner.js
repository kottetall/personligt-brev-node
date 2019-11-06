"use strict"

// används för att kunna extrahera funktionerna till tester i Node med Jest
if (typeof module !== "undefined") {
    module.exports = {
        // TODO: Kolla så alla funktioner finns med för test
        SetFetchOptions
    }
}

function toCapitalized() {
    return this.replace(/^\w/, this.substring(0, 1).toUpperCase())
}

function SetFetchOptions(body) {
    // let errorExists = false
    if (typeof body !== "object") {
        throw new Error(`"${body}" är inget objekt. Body behöver vara i JSON-/objektformat.`)
    }

    this.method = "POST"
    this.headers = {
        "Content-Type": "application/json"
    }
    this.body = JSON.stringify(body)

}

function User() {
    // TODO: kopiera el skapa motsvarivghet på server
    this.create = (namn) => {
        this.information = {
            grunduppgifter: {
                kontaktuppgifter: "",
                hemsida: "",
                rubrik: "",
                halsning: "",
                namn: namn
            },
            kategorier: [
                "om",
                "erfarenheter",
                "egenskaper",
                "kunskaper"
            ],
            nyckelord: {},
            text: {}
        }
    }

    this.addGrunduppgift = (uppgift, text) => {
        this.information.grunduppgifter[uppgift] = text //FIXME: Lägg till kontroll av input(gäller alla)!!!
        this.saveLocal()
    }

    this.addKeyWord = (nyckel, kategori, text) => {
        const id = Date.now() //FIXME: fixa en uppdateringsfunktion, som det är nu skapas en ny post med ett nytt id
        if (!this.information.kategorier.includes(kategori)) {
            this.information.kategorier.push(kategori)
        }
        this.information.text[id] = text
        this.information.nyckelord[nyckel] = {
            id,
            kategorier: kategori
        }
        this.saveLocal()
    }

    this.saveLocal = () => {
        window.localStorage.setItem("userData", JSON.stringify(this.information))
    }
    this.grab = () => {
        return this.information = JSON.parse(window.localStorage.getItem("userData"))
    }
    this.clear = () => {
        window.localStorage.clear()
        this.information = {}
    }
}

function Annons(serverAnnons) {

    this.nyAnnons = (nyAnnons) => {
        this.serverAnnons = nyAnnons
        this.saveLocal(this.serverAnnons)
        this.hittadeNyckelord = []
    }

    this.anvandarensNyckelord = (nyckelordsObjekt) => {
        for (const nyckel in nyckelordsObjekt) {
            if (this.serverAnnons.annonsen.description.text.toLowerCase().includes(nyckel)) {
                this.hittadeNyckelord.push([nyckel, nyckelordsObjekt[nyckel]])
            }
        }
    }

    this.grab = () => {
        return JSON.parse(window.sessionStorage.getItem("serverAnnons"))
    }

    this.saveLocal = (data) => {
        window.sessionStorage.setItem("serverAnnons", JSON.stringify(data))
    }

    this.serverAnnons = serverAnnons

    this.saveLocal(serverAnnons) //När en ny instans skapas så sparas den samtidigt
}

function PersonligtBrev() {
    this.text = {
        kategorier: {},
        grunduppgifter: {},
        annonsUppgifter: {}
    }

    this.createText = (anvandare, annons) => {
        this.text.kategorier = {} // för att inte skapa dubbletter vid uppdatering av ord samtidigt som en annons är uppe

        for (const ordData of annons.hittadeNyckelord) {
            const [ord, ordMeta] = ordData //för läsbarhet
            const kategori = ordMeta.kategorier //för läsbarhet

            if (!this.text.kategorier[kategori]) {
                this.text.kategorier[kategori] = []
            }
            this.text.kategorier[kategori].push([ord, anvandare.information.text[ordMeta.id]])
        }

        this.text.grunduppgifter = anvandare.information.grunduppgifter
        //header - företag och annonsuppgifter
        const annonsen = annons.serverAnnons.annonsen
        this.text.annonsUppgifter.foretagsNamn = annonsen.employer.name
        this.text.annonsUppgifter.jobbtitel = annonsen.headline //kan behöva ändras till någon annan del av annonsen
        this.text.annonsUppgifter.markning = annonsen.application_details.reference
        this.text.annonsUppgifter.ansok = annonsen.application_details.url
        this.text.annonsUppgifter.deadline = annonsen.application_deadline
        this.text.annonsUppgifter.originalAnnons = annonsen.webpage_url
    }
}

function rensaOchKontrolleraInput(input) {
    const getIdRegex = /([\d\-]+)/
    return input.trim().toLowerCase().match(getIdRegex)[0]
}

async function hanteraAnnons() {
    const input = document.querySelector("#annonsId").value
    const id = rensaOchKontrolleraInput(input)

    const options = new SetFetchOptions({
        annonsid: id
    })
    const data = await fetch("/annonsid", options)
    const svar = await data.json()
    const annons = new Annons(svar)
    console.log(annons)
}

function test(string) {
    //FIXME: Exempel på hur man kan göra ett testRegex av de nyckelord som läggs in. t.ex kan man göra så att mellanrum och "-" kan sökas samtidigt så att "office-paketet", "officepaketet" och "office paketet" ger utslag

    const prov = "e"
    const regEx = new RegExp(`${prov}`, "g")

}