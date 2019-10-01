"use strict"

function dummyText() {

    // fyller alla fält. Används vid text och för att visa

    document.querySelector(".kontakt").textContent = "Namn - 07XX-XXXXXX"
    document.querySelector(".jobbtitel").textContent = "Yrke X"
    document.querySelector(".markning").textContent = "ÅÅ/XXYYZZ"
    document.querySelector(".egenSida").textContent = "Egen hemsida"
    document.querySelector(".foretagsNamn").textContent = "Foretagsnamn"
    document.querySelector(".sidnr").textContent = "sida X av Y"
    document.querySelector(".sida h1").textContent = rubrik;



    let text = "";
    for (let brod of brodText) {
        text += brod;
    }

    const delar = [
        ".ommig",
        ".egenskaper",
        ".erfarenheter",
        ".kunskaper",
        ".flytt",
        ".halsning"
    ]

    try {
        //för att fylla delarna
        for (let i = 0; i < delar.length; i++) {
            document.querySelector(delar[i] + " .text").innerHTML = brodText[i]
        }
    } catch (error) {
        // trolig trigger är att functionen körs utifrån Github, vilket gör att variabeln "brodText" inte finns pga att den ligger i en js-fil i mappen "tmp" som är finns på gitignore-listan
        alert("denna funktion fungerar enbart för utvecklaren")
    }
}

function tomAllt() {
    // fyller alla fält. Används vid text och för att visa

    document.querySelector(".kontakt").textContent = ""
    document.querySelector(".jobbtitel").textContent = ""
    document.querySelector(".markning").textContent = ""
    document.querySelector(".egenSida").textContent = ""
    document.querySelector(".foretagsNamn").textContent = ""
    document.querySelector(".sidnr").textContent = ""
    document.querySelector(".sida h1").textContent = "";



    let text = "";
    for (let brod of brodText) {
        text += brod;
    }

    const delar = [
        ".ommig",
        ".egenskaper",
        ".erfarenheter",
        ".kunskaper",
        ".flytt",
        ".halsning"
    ]

    for (let i = 0; i < delar.length; i++) {
        document.querySelector(delar[i] + " .text").textContent = ""
    }
}

function devMiljo() {
    const local = location.hostname
    return local === "localhost" || local === "127.0.0.1"
}


function doljVisaVerktyg() {
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

function taFramAnnonsOrd(annonsText, minMax) {
    annonsText = annonsText.split(/[\s\n\t\.!,?\/]/) // funkar ej med \W då det även splittar åäö

    // fyller på minMax(gränser för kompetensordslängder) om den inte angivits, istället för ett default i funktionsdeklarationen
    minMax = minMax || {
        min: 0,
        max: 100
    }

    const temp = {}
    for (const ord of annonsText) {
        if (ord !== "" && ord.length >= minMax.min && ord.length <= minMax.max) {
            // lägg till längdgräns för ord - är onödigt att spara ord med 1 bokstav om alla ord de ska matchas mot är över 3 bokstäver. 

            temp[ord.toLowerCase()] = true;
        }
    }

    const annonsOrd = Object.keys(temp)

    return annonsOrd
}

async function hamtaJobbAnnons(minMax) {
    // hämtar platsannonser genom arbetsförmedlingens API utifrån annonsID. Enligt hemsidan: https://jobtechdev.se/api/jobs/platsbanken/ ska den gamla sluta stödjas från 1 sep. Dock funkar den fortfarande(2 sep) och det finns ingen tydlig ingång mer än att man kontaktar dem och får tillgång till en BETA-version av den nya. 
    // Grundhämtningen sker utifrån https://api.arbetsformedlingen.se/af/v0/platsannonser/<ANNONSID>

    const annonsId = document.querySelector(".annonsId").value || 8426124

    //NYA
    skickaTillServer(annonsId)
    //NYA


    //GAMMALT FRÅN PROTO

    let url = "https://api.arbetsformedlingen.se/af/v0/platsannonser/" + annonsId;

    const data = await fetch(url)
    // const status = data.status
    switch (data.status) {
        case 200:
            const annonsOriginal = await data.json()
            const annonsOrd = taFramAnnonsOrd(annonsOriginal.platsannons.annons.annonstext, minMax)

            const annonsBearbetad = {
                annons: annonsOriginal.platsannons.annons.platsannonsUrl,
                rubrik: annonsOriginal.platsannons.annons.annonsrubrik,
                annonsText: annonsOriginal.platsannons.annons.annonstext,
                annonsOrd: annonsOrd,
                yrkesBenamning: annonsOriginal.platsannons.annons.yrkesbenamning,
                referens: annonsOriginal.platsannons.ansokan.referens,
                ansok: annonsOriginal.platsannons.ansokan.webbplats,
                arbetsplatsNamn: annonsOriginal.platsannons.arbetsplats.arbetsplatsnamn,
                arbetsplatsKommun: annonsOriginal.platsannons.annons.kommunnamn
            }
            return annonsBearbetad
        case 404:
            alert(`AnnonsID: "${annonsId}", verkar inte finnas.\n\nKontrollera så du angett rätt ID`)
    }

    //GAMMALT FRÅN PROTO
}

async function hamtaGrund() {
    // hämtar de "beskrivningar" som används i brevet

    const fil = devMiljo() ? "src/grunder.json" : "src/grunderDummy.json"

    const data = await fetch(fil)
    const grunder = await data.json()

    //räknar ut längsta och kortaste kompetenserna för att sålla bort delar av annonsen som sedan ska jämföras. Finns ingen idé att jämföra ord med 1 bokstav om alla kompetenser är 4 bokstäver eller längre

    let min, max

    const delar = Object.keys(grunder.text)
    for (const del of delar) {
        const subDelar = Object.keys(grunder.text[del])
        for (const subDel of subDelar) {
            const langd = subDel.length
            if (!min) {
                min = max = langd
            }
            if (langd > max) {
                max = langd
            } else if (langd < min) {
                min = langd
            }
        }
    }

    grunder["minMax"] = {
        min,
        max
    }
    return grunder
}

function jamforaAnnonsGrund(annonsBearbetad, grunder) {


    const annonsNyckelord = annonsBearbetad.annonsOrd
    const delar = Object.keys(grunder.text)

    const matchadeKompetenser = {}

    for (const del of delar) {
        const subDelar = Object.keys(grunder.text[del])
        matchadeKompetenser[del] = []
        for (const subDel of subDelar) {
            if (annonsNyckelord.includes(subDel.toLowerCase())) {
                // matchningarna mellan sökanden och annonsen sparas här. Fördelade under samma underrubriker som i grunden
                matchadeKompetenser[del].push(subDel)
            }
        }
    }
    annonsBearbetad["matchadeKompetenser"] = matchadeKompetenser
}

function enableAnsok(lank) {
    const ansok = document.querySelector(".ansok")
    ansok.setAttribute("href", lank)
}

function enableBesok(lank) {
    // ändra till öppna i Iframe som kommer in från sidan el. ersätt iframe med ny div med annonstexten
    const besok = document.querySelector(".besokAnnons")
    besok.setAttribute("href", lank)
}

function lagginText(mal, matchatOrd, matchadText) {

    const span = document.createElement("span")
    if (matchatOrd === matchadText) {
        span.classList.add("tom")
    } else {
        span.classList.add("motivering")
    }

    const forklaring = document.createElement("span")
    forklaring.textContent = matchatOrd
    forklaring.classList.add("forklaring")

    span.textContent = `${matchadText}`

    span.appendChild(forklaring)
    mal.appendChild(span)
}

function uppdateraHelaDokumentet(annonsBearbetad, grunder) {
    const kontakt = document.querySelector(".kontakt")
    const jobbtitel = document.querySelector(".jobbtitel")
    const markning = document.querySelector(".markning")
    const egenSida = document.querySelector(".egenSida")
    const foretagsNamn = document.querySelector(".foretagsNamn")
    // const sidnr = document.querySelector(".sidnr") //sköts genom funktion - uppdateraSidnummer
    const rubrik = document.querySelector(".rubrik")
    const omMig = document.querySelector(".ommig .text")
    const egenskaper = document.querySelector(".egenskaper .text")
    const erfarenheter = document.querySelector(".erfarenheter .text")
    const kunskaper = document.querySelector(".kunskaper .text")
    const flytt = document.querySelector(".flytt .text")
    const halsning = document.querySelector(".halsning .text")

    // Tömmer alla fält så att ev dummytext/placeholders inte kommer med
    tomAllt()

    //sätter ansökningslänken
    enableAnsok(annonsBearbetad.ansok)
    //sätter länken till annonsen
    enableBesok(annonsBearbetad.annons)

    kontakt.textContent = grunder.grunduppgifter.kontaktuppgifter

    let titel = annonsBearbetad.rubrik
    jobbtitel.textContent = titel

    uppdateraSidnummer() //uppdaterar sidnumreringen, funktionen skriver direkt

    // saknas referens i annonsen blir fältet tomt
    markning.textContent = annonsBearbetad.referens ? `Ref: ${annonsBearbetad.referens}` : ""
    egenSida.textContent = "www.kottetall.com"
    foretagsNamn.textContent = annonsBearbetad.arbetsplatsNamn

    // kollar om arbetsplatsen ligger i Skaraborg, om inte läggs en passage om flytt till
    let kommunNara = grunder.grunduppgifter.staderSkaraborg.includes(annonsBearbetad.arbetsplatsKommun)
    flytt.textContent = kommunNara ? "" : grunder.grunduppgifter.flytt

    rubrik.textContent = grunder.grunduppgifter.rubrik
    halsning.textContent = `${grunder.grunduppgifter.halsning} // ${grunder.grunduppgifter.namn}`




    const matchadeKompetenser = annonsBearbetad.matchadeKompetenser

    // DYNAMISK TEXT //

    // Om mig
    if (matchadeKompetenser["om"].length < 1) {
        omMig.textContent = ""
    }
    for (const komp of matchadeKompetenser["om"]) {
        lagginText(omMig, komp, grunder.text.om[komp])
    }

    // Egenskaper
    if (matchadeKompetenser["egenskaper"].length < 1) {
        egenskaper.textContent = ""
    }
    for (const komp of matchadeKompetenser["egenskaper"]) {
        lagginText(egenskaper, komp, grunder.text.egenskaper[komp])
    }

    //erfarenheter
    if (matchadeKompetenser["erfarenheter"].length < 1) {
        erfarenheter.textContent = ""
    }
    for (const komp of matchadeKompetenser["erfarenheter"]) {
        lagginText(erfarenheter, komp, grunder.text.erfarenheter[komp])
    }

    //kunskaper
    if (matchadeKompetenser["kunskaper"].length < 1) {
        kunskaper.textContent = ""
    }
    for (const komp of matchadeKompetenser["kunskaper"]) {
        lagginText(kunskaper, komp, grunder.text.kunskaper[komp])
    }
}

async function uppdateraAllt() {
    // hämtar sökandes uppgifter
    const grunder = await hamtaGrund()

    try {

        // hämtar annonsens uppgifter
        const annonsBearbetad = await hamtaJobbAnnons(grunder.minMax)

        // jämför annons och sökande
        jamforaAnnonsGrund(annonsBearbetad, grunder)
        // Uppdaterar och fyller i allt
        uppdateraHelaDokumentet(annonsBearbetad, grunder)
        // döljer verktygsmenyn
        doljVisaVerktyg()

        // document.querySelector(".annonsId").value = ""

    } catch (error) {
        const msg = `Pga felaktigt annonsID går det inte att uppdatera dokumentet.`
        console.log(msg)
    }
}

async function skickaTillServer(annonsId) {

    const dataSkickas = {
        annonsid: annonsId
    }

    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSkickas)
    }

    const svar = await fetch("annonsid/", fetchOptions)
    const msg = await svar.json()
    if (msg["error"]) {
        console.log(msg["error"])
    } else {
        console.log(msg)
    }
}