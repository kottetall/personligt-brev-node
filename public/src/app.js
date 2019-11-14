"use strict"

// Lägger till möjligheten att starta ord/meningar med stor bokstav
String.prototype.toCapitalized = toCapitalized

window.onload = () => {

    // hämtar ev sparade anv.uppgifter
    let anvandare = new User()
    anvandare.grab()
    // TESTDEL
    //FIXME:

    console.log(anvandare)
    let annons = new Annons(exempelAnnons)
    annons.nyAnnons(exempelAnnons)
    if (anvandare.information) {
        annons.anvandarensNyckelord(anvandare.information.nyckelord)
    }


    annons.saveLocal(annons.serverAnnons)
    const brev = new PersonligtBrev()
    if (anvandare.information) {
        brev.createText(anvandare, annons)
        updateBrev(brev)
    }
    console.log(annons)
    console.log(brev)
    //FIXME:
    // TESTDEL


    if (anvandare.information) {
        updateUppgifterModal(anvandare)
    }

    document.querySelector(".innehall .fa-plus-circle").addEventListener("click", (e) => {
        let nyKategori = prompt("Vad ska den nya kategorin heta?").trim().toLowerCase()
        anvandare.information.kategorier.push(nyKategori)
        anvandare.saveLocal()
        console.log(`${nyKategori} har lagts till som kategori`)
        updateUppgifterModal(anvandare)
    })

    document.querySelector("#anvandarUppgiftTyp").addEventListener("change", (e) => {
        //TODO: slå ihop med nedan
        const rutText = e.target.value.toLowerCase().trim()
        const {
            grunduppgifter
        } = anvandare.information
        if (grunduppgifter[rutText]) {
            document.querySelector("#anvandarUppgiftText").value = grunduppgifter[rutText]
        } else {
            document.querySelector("#anvandarUppgiftText").value = ""
        }
    })

    document.querySelector("#nyckelord").addEventListener("keyup", (e) => {
        // Om man redan skrivit om ordet fylls beskrivningen i textfältet och man kan ändra och spara
        const rutText = e.target.value.toLowerCase().trim()
        const {
            nyckelord,
            text
        } = anvandare.information
        const kategoriElement = document.querySelector("#kategori")

        if (nyckelord[rutText]) {
            document.querySelector("#brodText").value = text[nyckelord[rutText]["id"]]
            kategoriElement.value = nyckelord[rutText]["kategorier"]
        } else {
            document.querySelector("#brodText").value = ""

            // Ändrar tillbaka till tidigare vald kategori ifall man ändrar sig
            if (kategoriElement.dataset["tidigareKategori"]) {
                kategoriElement.value = kategoriElement.dataset["tidigareKategori"]
            } else {
                kategoriElement.dataset["tidigareKategori"] = kategoriElement.value
            }
        }
    })

    document.querySelector("#uppdateraAnvandaruppgifter").addEventListener("click", (e) => {
        // uppdaterar grunduppgifter - kontaktuppgifter etc
        e.preventDefault() //TODO: Nödvändig?
        const anvandarUppgiftTyp = document.querySelector("#anvandarUppgiftTyp").value.toLowerCase()
        const anvandarUppgiftText = document.querySelector("#anvandarUppgiftText").value.toLowerCase()
        let brodText = document.querySelector("#brodText").value

        if (!anvandarUppgiftText) {
            alert("Du har missat att fylla i nyckelordet")
            return
        }
        if (!anvandarUppgiftText) {
            if (!confirm(`Du har inte skrivit något om ${anvandarUppgiftTyp}. Vill du ändå spara det(utfyllnadstext kommer sparas istället)?`)) {
                return
            } else {
                brodText = `TEXT SAKNAS FÖR ORDET " ${anvandarUppgiftTyp.toUpperCase()}"`
            }
        }
        anvandare.addGrunduppgift(anvandarUppgiftTyp, anvandarUppgiftText)
        updateUppgifterModal(anvandare)
        console.log("användardatan har uppdaterats")
    })

    document.querySelector("#uppdatera").addEventListener("click", (e) => {
        //uppdaterar nyckelord
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
        annons.anvandarensNyckelord(anvandare.information.nyckelord) //TODO: lägg samman dessa så det räcker med en funktion för att göra alla nödvändiga uppdateringar
        updateUppgifterModal(anvandare)
        brev.createText(anvandare, annons)
        updateBrev(brev)
        console.log("användardatan har uppdaterats")
    })

    const ikoner = document.querySelectorAll(".val .ikonhallare")
    for (const ikon of ikoner) {
        ikon.addEventListener("click", () => showModal(ikon))
        ikon.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                showModal(ikon)
            }
        })
    }

    const stanga = document.querySelectorAll(".fa-times-circle")
    for (const stang of stanga) {
        stang.addEventListener("click", (e) => {
            stangModal(stang.parentElement)
        })
    }

    document.querySelector(".hamtaAnnons").addEventListener("click", hanteraAnnons)
    document.querySelector(".hamtaAnnonsContainer").addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            hanteraAnnons()
        }
    })

    document.querySelector(".input h3").addEventListener("click", (e) => {
        const mal = e.target
        if (mal.localName === "span") {
            const malTyp = mal.dataset.rubrik
            mal.classList.remove("not-active")
            const malForm = document.querySelector(".form-" + malTyp)
            malForm.setAttribute("aria-hidden", false)

            const syskon = mal.nextElementSibling || mal.previousElementSibling
            const syskonTyp = syskon.dataset.rubrik
            syskon.classList.add("not-active")
            const syskonForm = document.querySelector(".form-" + syskonTyp)
            syskonForm.setAttribute("aria-hidden", true)
        }
    })

    document.querySelector("#skapaNyAnvandare").addEventListener("click", (e) => {
        e.preventDefault()
        if (!anvandare.information) {
            anvandare.create()
        }
        const inputs = document.querySelectorAll(".form-nyAnvandare input")
        for (const input of inputs) {
            if (input.name !== "losenord")
                if (input.value) {
                    anvandare.addGrunduppgift(input.name, input.value)
                }
        }

        brev.createText(anvandare, annons)
        updateBrev(brev)
        stangModal(e.target.parentElement.parentElement.parentElement) //TODO: snygga till!

    })

}




// *** TEST *** //TODO:

// document.querySelector(".test-user").addEventListener("click", skapaLokalTestAnvandare)
// document.querySelector(".clear-data").addEventListener("click", rensaLokalTestAnvandare)