"use strict"

window.onload = () => {

    // hämtar ev sparade anv.uppgifter
    let anvandare = new User()
    anvandare.grab()
    // TESTDEL
    //FIXME:
    console.log(anvandare)
    let annons = new Annons(exempelAnnons)
    // annons.nyAnnons(exempelAnnons)
    annons.unikaAnnonsOrd(anvandare.information.nyckelord)
    // annons.saveLocal(annons.serverAnnons)
    const brev = new PersonligtBrev()
    brev.createText(anvandare, annons)
    updateBrev(brev)
    console.log(annons)
    console.log(brev)
    //FIXME:
    // TESTDEL


    if (anvandare.information) {
        updateUppgifterModal(anvandare)
    }

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
        if (nyckelord[rutText]) {
            document.querySelector("#brodText").value = text[nyckelord[rutText]["id"]]
        } else {
            document.querySelector("#brodText").value = ""
        }
    })

    document.querySelector("#uppdateraAnvandaruppgifter").addEventListener("click", (e) => {
        e.preventDefault() //TODO: Nödv ändig?
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
        updateUppgifterModal(anvandare)
        console.log("användardatan har uppdaterats")
    })



    const showHide = document.querySelectorAll(".showHide")
    for (const sh of showHide) {
        sh.addEventListener("click", (e) => {
            const hidden = JSON.parse(e.target.parentElement.dataset.hidden) //för att göra sträng till bool
            e.target.parentElement.dataset.hidden = !hidden //gömmer hela modal
            e.target.nextElementSibling.setAttribute("aria-hidden", !hidden) // ändrar aria för innehållsdiv i modal
        })
    }

    document.querySelector(".hamtaAnnons").addEventListener("click", hanteraAnnons) //TODO: lägg till hantering för ENTER


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
}




// *** TEST *** //TODO:

document.querySelector(".test-user").addEventListener("click", skapaLokalTestAnvandare)
document.querySelector(".clear-data").addEventListener("click", rensaLokalTestAnvandare)