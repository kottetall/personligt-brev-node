"use strict"

window.onload = () => {

    // *** TEST ***

    //testdata
    let userData = JSON.parse(window.localStorage.getItem("userData"))

    console.log(JSON.parse(window.localStorage.getItem("currentAd"))) //TODO: tillfällig för test
    console.log(userData) //TODO: tillfällig för test

    //testfunktioner
    const kategoriLista = document.querySelector("#kategori")
    for (const kat of Object.keys(userData.text)) {
        const option = document.createElement("option")
        option.setAttribute("value", kat)
        option.textContent = kat
        kategoriLista.appendChild(option)
    }

    const nuvarandeNyckelord = document.querySelector("#nuvarande")
    for (const kat of Object.keys(userData.text)) {
        // TODO: skriv om med recursion
        for (const nyckel of Object.keys(userData.text[kat])) {
            const option = document.createElement("option")
            option.setAttribute("value", `${kat}-${nyckel}`)
            option.textContent = nyckel
            nuvarandeNyckelord.appendChild(option)
        }
    }

    nuvarandeNyckelord.addEventListener("change", (e) => {
        const text = e.target.value.split("-")
        document.querySelector(".textNuvarande").textContent = userData.text[text[0]][text[1]]
    })

    document.querySelector(".uppdatera").addEventListener("click", (e) => {
        e.preventDefault()
        // TODO: snygga till hämtningen
        const kategori = document.querySelector("#kategori").value
        const nyckelOrd = document.querySelector("#nyckelord").value
        const brodText = document.querySelector("#brodText").value

        userData.text[kategori][nyckelOrd] = brodText
        window.localStorage.setItem("userData", JSON.stringify(userData))
        console.log(userData)

    })

    // *** TEST ***

    // för att kunna ta bort/lägga till delar
    document.querySelector(".hamtaAnnons").addEventListener("click", uppdateraAllt)
    document.querySelector(".annonsId").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            uppdateraAllt()
        }
    })

    document.querySelector(".doljVisa").addEventListener("click", doljVisaVerktyg)

    document.querySelector(".user-data").addEventListener("click", async (e) => {
        //TODO: Testgrej!!
        const fetchOptions = new SetFetchOptions({
            id: window.localStorage.getItem("currentUser")
        }, "POST")

        const jsonsvar = await fetch("/hamtaAnvandare", fetchOptions)
        const svar = await jsonsvar.json()

        window.localStorage.setItem("userData", JSON.stringify(svar))
        console.log(svar)

    })

    document.querySelector(".test-user").addEventListener("click", () => {
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
        window.localStorage.setItem("userData", JSON.stringify(data))
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
            window.localStorage.setItem("userData", JSON.stringify(svar.data))
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

        window.localStorage.setItem("userData", JSON.stringify(data))

    }, {
        passive: true
    })

    document.querySelector(".clear-data").addEventListener("click", () => {
        if (window.confirm("Vill du verkligen radera datan som finns sparad?")) {
            window.localStorage.clear()
            alert("Datan är raderad")
        } else {
            alert("Du valde att avbryta")
        }
    })
}