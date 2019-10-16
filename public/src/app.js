"use strict"

window.onload = () => {

    // hämtar ev sparade anv.uppgifter
    let anvandare = new User()
    anvandare.grab()

    console.log(anvandare)

    if (anvandare.information) {
        //TODO: Ev koppla detta med visa/dölj meny, så att JS inte blockar laddningen genom att fixa detta som ändå inte kommer/ska synas innan man öppnar modal
        //setup om användare finns sparad
        const kategoriLista = document.querySelector("#kategori")
        for (const kat of anvandare.information.kategorier) {
            const option = document.createElement("option")
            option.setAttribute("value", kat)
            option.textContent = kat
            kategoriLista.appendChild(option)
        }

        const nuvarandeNyckelord = document.querySelector("#nuvarande")
        // TODO: skriv om med recursion
        for (const nyckel of Object.entries(anvandare.information.nyckelord)) {
            const option = document.createElement("option")
            option.setAttribute("value", nyckel[1]["id"])
            option.textContent = nyckel[0]
            nuvarandeNyckelord.appendChild(option)
        }
        nuvarandeNyckelord.addEventListener("change", (e) => {
            const id = e.target.value.toLowerCase()
            document.querySelector(".textNuvarande").textContent = anvandare.information.text[id]
        })
    }

    document.querySelector("#nyckelord").addEventListener("keyup", (e) => {
        // Om man redan skrivit om ordet fylls beskrivningen i textfältet och man kan ändra och spara
        const rutText = e.target.value.toLowerCase()
        if (anvandare.information.nyckelord[rutText]) {
            document.querySelector("#brodText").value = anvandare.information.text[anvandare.information.nyckelord[rutText]["id"]]
        } else {
            document.querySelector("#brodText").value = ""
        }
    })

    document.querySelector(".uppdatera").addEventListener("click", (e) => {
        e.preventDefault() //TODO: Nödv ändig?
        const kategori = document.querySelector("#kategori").value.toLowerCase()
        const nyckelOrd = document.querySelector("#nyckelord").value.toLowerCase()
        let brodText = document.querySelector("#brodText").value

        if (!nyckelOrd) {
            alert("Du har missat att fylla i nyckelordet")
            return
        }
        if (!brodText) {
            if (!confirm(`Du har inte skrivit något om ${nyckelOrd}. Vill du ändå spara det(utfyllnadstext kommer sparas istället)?`)) {
                return
            } else {
                brodText = `TEXT SAKNAS FÖR ORDET " ${nyckelOrd.toUpperCase()}"`
            }
        }
        anvandare.addKeyWord(nyckelOrd, kategori, brodText)
        anvandare.saveLocal()
        location.reload()
        console.log("användardatan har uppdaterats")
    })

    // *** TEST ***


    document.querySelector(".user-data").addEventListener("click", async (e) => {
        //TODO: Testgrej!!
        const fetchOptions = new SetFetchOptions({
            id: window.localStorage.getItem("currentUser")
        }, "POST")

        const jsonsvar = await fetch("/hamtaAnvandare", fetchOptions)
        const svar = await jsonsvar.json()

        console.log("har ännu inte någon funktion som hanterar svaret")

    })

    document.querySelector(".test-user").addEventListener("click", () => {
        const namn = prompt("Vad är namnet på testanvändaren?") || "test"
        anvandare.create(namn)
        anvandare.saveLocal()
        location.reload()
    })

    document.querySelector(".new-user").addEventListener("click", async (e) => {
        const namn = prompt("Vad är ditt namn?") || "test"

        const fetchOptions = new SetFetchOptions({
            "namn": namn
        }, "POST")

        const jsonSvar = await fetch("/ny", fetchOptions)
        const svar = await jsonSvar.json()

        console.log(`Meddelandet togs emot av servern`)
        if (svar.data) {
            anvandare.saveLocal(svar.data)
            console.log("har ännu inte någon funktion som hanterar svaret")
        } else {
            alert(svar.meddelande)
        }
    }, {
        passive: true
    })

    document.querySelector(".update-user").addEventListener("click", async (e) => {
        const namn = prompt("Vad vill du ändra namnet till?") || "test"
        const data = JSON.parse(window.localStorage.getItem("userData"))
        console.log(data)
        data.grunduppgifter.namn = namn
        const fetchOptions = new SetFetchOptions({
            data
        }, "POST")

        const jsonSvar = await fetch("/uppdatera", fetchOptions)
        const svar = await jsonSvar.json()

        console.log(`Meddelandet togs emot av servern`)
        console.log(svar)
        console.log("har ännu inte någon funktion som hanterar svaret")

    }, {
        passive: true
    })

    document.querySelector(".clear-data").addEventListener("click", () => {
        if (window.confirm("Vill du verkligen radera datan som finns sparad?")) {
            anvandare.clear()
            location.reload()
            alert("Datan är raderad")
        } else {
            alert("Du valde att avbryta")
        }
    })

    const showHide = document.querySelectorAll(".showHide")
    for (const sh of showHide) {
        sh.addEventListener("click", (e) => {
            const hidden = JSON.parse(e.target.parentElement.dataset.hidden) //för att göra sträng till bool
            e.target.parentElement.dataset.hidden = !hidden //gömmer hela modal
            e.target.nextElementSibling.setAttribute("aria-hidden", !hidden) // ändrar aria för innehållsdiv i modal
        })
    }
}