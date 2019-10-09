// mock API-svar
// const hamtadAnnons = require("../exempel/annons.json")
// const {
//     text: annonsText
// } = hamtadAnnons.annonsen.description

const {
    hamtaEnskildaAnnonsOrd,
    rensaAnnonsen
} = require("../custom_modules/bearbetning")

describe("Test av funktionen 'hamtaEnskildaAnnonsOrd'", () => {
    test("Funktionen ger rätt resultat", () => {
        const annonsTextMock = "av datakunskap dotterbolag"
        const forvantatSvar = [
            "av", "datakunskap", "dotterbolag"
        ]

        expect(hamtaEnskildaAnnonsOrd(annonsTextMock)).toEqual(forvantatSvar)
    })

    test("Funktionen ger lowercase", () => {
        expect(hamtaEnskildaAnnonsOrd("TeSt")).toEqual([
            "test"
        ])
    })

    test("Funktionen håller ihop ord med 'åäö' m.fl", () => {

        const annonsTextMock = "råder"
        const forvantatSvar = [
            "råder"
        ]

        expect(hamtaEnskildaAnnonsOrd(annonsTextMock)).toEqual(forvantatSvar)
    })

    test("Funktionen sorterar svaret", () => {

        const annonsTextMock = "d c u a"
        const forvantatSvar = [
            "a", "c", "d", "u"
        ]

        expect(hamtaEnskildaAnnonsOrd(annonsTextMock)).toEqual(forvantatSvar)
    })

    test("Funktionen sorterar 'åäö'", () => {

        const annonsTextMock = "ä ö å"
        const forvantatSvar = [
            "å", "ä", "ö"
        ]

        expect(hamtaEnskildaAnnonsOrd(annonsTextMock)).toEqual(forvantatSvar)
    })

    test("Funktionen sorterar 'åäö' tillsammans med övriga bokstäver", () => {

        const annonsTextMock = "å e ö"
        const forvantatSvar = [
            "e", "å", "ö"
        ]

        expect(hamtaEnskildaAnnonsOrd(annonsTextMock)).toEqual(forvantatSvar)
    })
})


describe("Test av funktionen 'rensaAnnonsen'", () => {

    // TODO:    Lägg till test för funktionen

})