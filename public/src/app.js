"use strict"

window.onload = () => {

    // för att kunna ta bort/lägga till delar
    document.querySelector(".hamtaAnnons").addEventListener("click", uppdateraAllt)
    document.querySelector(".annonsId").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            uppdateraAllt()
        }
    })

    document.querySelector(".doljVisa").addEventListener("click", doljVisaVerktyg)

    document.querySelector(".new-user").addEventListener("click", async (e) => {
        const namn = prompt("Vad är ditt namn?") || "test"

        const fetchOptions = new SetFetchOptions({
            "namn": namn
        }, "POST")

        const jsonSvar = await fetch("/ny", fetchOptions)
        const svar = await jsonSvar.json()

        console.log(`Meddelandet togs emot av servern`)
        if (svar.data) {
            window.localStorage.setItem("currentUser", svar.data["_id"])
        } else {
            alert(svar.meddelande)
        }
    }, {
        passive: true
    })

    document.querySelector(".update-user").addEventListener("click", async (e) => {
        const namn = prompt("Vad vill du ändra namnet till?") || "test"
        const id = window.localStorage.getItem("currentUser")

        const fetchOptions = new SetFetchOptions({
            id: id,
            namn: namn
        }, "POST")

        const jsonSvar = await fetch("/uppdatera", fetchOptions)
        const svar = await jsonSvar.json()

        console.log(`Meddelandet togs emot av servern`)
        console.log(svar)
    }, {
        passive: true
    })
}