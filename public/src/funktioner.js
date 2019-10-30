"use strict"

// används för att kunna extrahera funktionerna till tester i Node med Jest
if (typeof module !== "undefined") {
    module.exports = {
        // TODO: Kolla så alla funktioner finns med för test
        SetFetchOptions
    }
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
        const id = Date.now()
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
    }

    this.unikaAnnonsOrd = (anvandareNyckelordObjekt) => {
        const anvandareNyckelordArray = Object.entries(anvandareNyckelordObjekt)
        this.gemensammaOrd = anvandareNyckelordArray.filter(ord => {
            if (this.serverAnnons.enskildaAnnonsOrd.includes(ord[0])) {
                return ord
            }
        })
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

        for (const ordData of annons.gemensammaOrd) {
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