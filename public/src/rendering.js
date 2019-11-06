"use strict"

// ALLMÄNNA
function removeChildren(parent) {
    const listChildren = parent.children
    for (let i = listChildren.length - 1; i >= 0; i--) {
        parent.removeChild(listChildren[i])
    }
}

// UPPGIFTSMODAL
function updateUppgifterModal(anvandare) {
    const {
        kategorier,
        grunduppgifter
    } = anvandare.information

    // Uppdaterar nyckelordskategorier i modal
    setSelect("#kategori", kategorier)

    // Uppdaterar grunduppgifter i modal
    setSelect("#anvandarUppgiftTyp", Object.keys(grunduppgifter))
}

function setSelect(malListaId, valArray) {
    const kategoriLista = document.querySelector(malListaId)
    removeChildren(kategoriLista)
    for (const kat of valArray) {
        const option = document.createElement("option")
        option.setAttribute("value", kat)
        option.textContent = kat
        kategoriLista.appendChild(option)
    }
}

// PERSONLIGT BREV
function updateBrev(brev) {

    // TODO: modulera/separera?

    const {
        foretagsNamn,
        jobbtitel,
        markning,
        ansok,
        deadline,
        originalAnnons
    } = brev.text.annonsUppgifter

    // Uppdaterar "verktygsdelen" - ansök, besök annons och deadline
    document.querySelector(".sistaAnsokDag").textContent = deadline.split("T")[0]
    document.querySelector(".ansok").setAttribute("href", ansok)
    document.querySelector(".besokAnnons").setAttribute("href", originalAnnons)

    // header - fotnoter
    document.querySelector(".foretagsNamn").textContent = foretagsNamn
    document.querySelector(".jobbtitel").textContent = jobbtitel
    document.querySelector(".markning").textContent = `Referens: "${markning}"`

    //rubrik
    document.querySelector(".rubrik").textContent = brev.text.grunduppgifter.rubrik.toCapitalized()

    // huvudsakliga texten
    const brodText = document.querySelector(".brodText")
    removeChildren(brodText) //Tömmer allt


    for (const kat in brev.text.kategorier) {

        const artikel = document.createElement("article")
        const beskrivning = document.createElement("span")
        beskrivning.classList.add("beskrivning")
        beskrivning.textContent = kat

        const text = document.createElement("div")
        text.classList.add("text")

        for (const ord of brev.text.kategorier[kat]) {
            const motivering = document.createElement("span")
            motivering.classList.add("motivering")
            motivering.textContent = ord[1]

            const forklaring = document.createElement("span")
            forklaring.classList.add("forklaring")
            forklaring.textContent = ord[0]

            motivering.append(forklaring)
            text.append(motivering)
        }
        artikel.append(beskrivning, text)
        brodText.appendChild(artikel)
    }

    // hälsningsfras m namn
    const halsningsfras = document.createElement("span")
    halsningsfras.className = "halsningsfras"
    halsningsfras.textContent = brev.text.grunduppgifter.halsning.toCapitalized()
    const br = document.createElement("br")

    const namn = document.createElement("span")
    namn.className = "halsning-namn"
    namn.textContent = brev.text.grunduppgifter.namn.toCapitalized()

    brodText.append(halsningsfras, br, namn)

    // footer - kontaktuppgifter etc
    const {
        hemsida,
        kontaktuppgifter
    } = brev.text.grunduppgifter

    document.querySelector(".egenSida").textContent = hemsida
    document.querySelector(".kontakt").textContent = kontaktuppgifter
    document.querySelector(".sidnr").textContent = "sida 1 av 1" //TODO: gör ev dynamisk

}

function showModal(triggerElement) {
    // TODO: lägga till tabordning ev ta tabindex="-1" när modals är gömda

    const malKlass = triggerElement.dataset.controls
    const malElement = document.querySelector("." + malKlass)
    const hidden = JSON.parse(malElement.dataset.hidden)
    malElement.dataset.hidden = !hidden
}