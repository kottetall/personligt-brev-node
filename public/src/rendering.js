"use strict"

// ALLMÄNNA
function removeChildren(parent) {
    const listChildren = parent.children
    for (let i = listChildren.length - 1; i > 0; i--) {
        parent.removeChild(listChildren[i])
    }
}

// UPPGIFTSMODAL
function updateUppgifterModal(anvandare) {
    const kategoriLista = document.querySelector("#kategori")
    removeChildren(kategoriLista)
    for (const kat of anvandare.information.kategorier) {
        const option = document.createElement("option")
        option.setAttribute("value", kat)
        option.textContent = kat
        kategoriLista.appendChild(option)
    }
}

// PERSONLIGT BREV
function updateBrev(brev) {

    // TODO: modulera/separera?

    // header - fotnoter
    const {
        foretagsNamn,
        jobbtitel,
        markning
    } = brev.text.annonsUppgifter

    document.querySelector(".foretagsNamn").textContent = foretagsNamn
    document.querySelector(".jobbtitel").textContent = jobbtitel
    document.querySelector(".markning").textContent = `Referens: "${markning}"`

    //rubrik
    document.querySelector(".rubrik").textContent = brev.text.grunduppgifter.rubrik

    // huvudsakliga texten
    const brodText = document.querySelector(".brodText")

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
    halsningsfras.textContent = brev.text.grunduppgifter.halsning
    const br = document.createElement("br")

    const namn = document.createElement("span")
    namn.className = "halsning-namn"
    namn.textContent = brev.text.grunduppgifter.namn

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