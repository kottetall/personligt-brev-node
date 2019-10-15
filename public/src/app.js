"use strict"

window.onload = () => {

    // *** TEST ***
    let anvandare = new User()
    anvandare.grab()

    console.log(anvandare)

    //testfunktioner
    if (anvandare.userData) {
        const kategoriLista = document.querySelector("#kategori")
        for (const kat of Object.keys(anvandare.userData.text)) {
            const option = document.createElement("option")
            option.setAttribute("value", kat)
            option.textContent = kat
            kategoriLista.appendChild(option)
        }

        const nuvarandeNyckelord = document.querySelector("#nuvarande")
        for (const kat of Object.keys(anvandare.userData.text)) {
            // TODO: skriv om med recursion
            for (const nyckel of Object.keys(anvandare.userData.text[kat])) {
                const option = document.createElement("option")
                option.setAttribute("value", `${kat}-${nyckel}`)
                option.textContent = nyckel
                nuvarandeNyckelord.appendChild(option)
            }
        }

        nuvarandeNyckelord.addEventListener("change", (e) => {
            // const userData = anvandare.grab()
            const text = e.target.value.split("-")
            document.querySelector(".textNuvarande").textContent = anvandare.userData.text[text[0]][text[1]]

        })
    }

    document.querySelector(".uppdatera").addEventListener("click", (e) => {
        e.preventDefault()
        // TODO: snygga till hämtningen
        const kategori = document.querySelector("#kategori").value
        const nyckelOrd = document.querySelector("#nyckelord").value
        const brodText = document.querySelector("#brodText").value

        if (anvandare.userData.text[kategori][nyckelOrd]) {
            if (!confirm(`Du är påväg att skriva över din tidigare text för ordet "${nyckelOrd}"\n Vill du detta?`)) {
                return
            }
        }
        anvandare.userData.text[kategori][nyckelOrd] = brodText
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

        anvandare.userData = svar // TODO: FIXME: Detta sätt gör att man kan mista data, som skrivs över, om man råkar trycka på "hämta"
        anvandare.saveLocal()
        console.log(svar)
        console.log(anvandare.userData)

    })

    document.querySelector(".test-user").addEventListener("click", () => {

        // TODO: fixa utifrån nya anvandare
        // FEJKFUNKTION!!! FÖR TEST ENBART
        function UserBase(namn) {
            this.grunduppgifter = {
                    kontaktuppgifter: "",
                    rubrik: "",
                    halsning: "",
                    namn: namn
                },

                this.text = {
                    om: {},
                    egenskaper: {},
                    erfarenheter: {},
                    kunskaper: {}
                }
        }

        const namn = prompt("Vad är namnet?") || "test"
        const data = new UserBase(namn)
        anvandare.userData = data
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
            // window.localStorage.setItem("userData", JSON.stringify(svar.data))
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
        anvandare.saveLocal(data)
        // window.localStorage.setItem("userData", JSON.stringify(data))

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

    // för att kunna ta bort/lägga till delar
    // document.querySelector(".hamtaAnnons").addEventListener("click", uppdateraAllt()) //FIXME: ger ett fel när man tar bort kommentaren
    document.querySelector(".annonsId").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            uppdateraAllt()
        }
    })

    document.querySelector(".doljVisa").addEventListener("click", doljVisaVerktyg())

    // dölja/visa input/ändringsmodal
    document.querySelector(".uppgifter").addEventListener("click", (e) => {
        const hidden = JSON.parse(e.target.parentElement.dataset.hidden) //för att göra sträng till bool
        e.target.parentElement.dataset.hidden = !hidden
    })

}