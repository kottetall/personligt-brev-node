"use strict"

function SetFetchOptions(body, method = "GET") {
    let errorExists = false
    if (typeof body !== "object") {
        throw new Error(`"${body}" är inget objekt. Body behöver vara i JSON-/objektformat.`)
    }

    if (method !== "GET" && method !== "POST") {
        throw new Error(`"${method}" är inte en giltig metod`)
    }

    this.method = method
    this.headers = {
        "Content-Type": "application/json"
    }
    this.body = JSON.stringify(body)

}

function doljVisaVerktyg() {
    //TODO: Skriv om
    const verktyg = document.querySelector(".verktyg")
    const doljVisa = document.querySelector(".doljVisa i")
    let dold = verktyg.getAttribute("data-dold")

    //dold blir string istället för booleon och därför behöv '==='

    if (dold === "true") {
        verktyg.classList.remove("dold")
        verktyg.classList.add("visa")
        verktyg.setAttribute("data-dold", "false")
        doljVisa.classList.remove("fa-chevron-right")
        doljVisa.classList.add("fa-chevron-left")

    } else if (dold === "false") {
        verktyg.classList.remove("visa")
        verktyg.classList.add("dold")
        verktyg.setAttribute("data-dold", "true")
        doljVisa.classList.remove("fa-chevron-left")
        doljVisa.classList.add("fa-chevron-right")
    }
}

function uppdateraSidnummer() {
    const allaSidor = document.querySelectorAll(".sidnr")
    const antalSidor = allaSidor.length

    for (let i = 0; i < antalSidor; i++) {
        allaSidor[i].textContent = `sida ${i+1} av ${antalSidor}`
    }
}

async function hamtaJobbAnnons(minMax) {

    const annonsId = document.querySelector(".annonsId").value || 8426124

    skickaTillServer(annonsId)
}

async function uppdateraAllt() {
    const annonsId = document.querySelector(".annonsId").value
    skickaTillServer(annonsId)
}

async function skickaTillServer(annonsId) {

    const dataSkickas = {
        annonsid: annonsId
    }

    const fetchOptions = new SetFetchOptions(dataSkickas, "POST")

    const svar = await fetch("annonsid/", fetchOptions)
    const msg = await svar.json()
    if (msg["error"]) {
        console.log(msg["error"])
    } else {
        console.log(msg)
    }
}

// används för att kunna extrahera funktionerna till tester i Node med Jest
if (typeof module !== "undefined") {
    module.exports = {
        // TODO: Kolla så alla funktioner finns med för test
    }
}