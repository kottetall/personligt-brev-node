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

    if (!devMiljo()) {
        document.querySelector(".modalforklaring").style.display = "block"
        document.querySelector(".modalforklaring button").addEventListener("click", () => {
            document.querySelector(".modalforklaring").style.display = "none"
        }, {
            passive: true
        })
    }

    dummyText()
}