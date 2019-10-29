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

    const inputRubriker = document.querySelectorAll(".input-rubrik")
    for (const inputRubrik of inputRubriker) {
        inputRubrik.addEventListener("click", (e) => {
            // FIXME:
        })
    }

    document.querySelector("#nyckelord").addEventListener("keyup", (e) => {
        // Om man redan skrivit om ordet fylls beskrivningen i textfältet och man kan ändra och spara
        const rutText = e.target.value.toLowerCase().trim()
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

}




// *** TEST *** //TODO:

document.querySelector(".test-user").addEventListener("click", skapaLokalTestAnvandare)
document.querySelector(".clear-data").addEventListener("click", rensaLokalTestAnvandare)