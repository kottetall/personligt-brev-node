const {
    SetFetchOptions,
    dummyText,
    tomAllt,
    devMiljo,
    doljVisaVerktyg,
    uppdateraSidnummer,
    taFramAnnonsOrd,
    hamtaJobbAnnons,
    hamtaGrund,
    jamforaAnnonsGrund,
    enableAnsok,
    enableBesok,
    lagginText,
    uppdateraHelaDokumentet,
    uppdateraAllt,
    skickaTillServer
} = require("../public/src/funktioner")

test("Tomt tillfälligt test", () => {
    expect(1).toBe(1)
    expect(1 + 1).toBe(2)
})

describe("SetFetchfunktionen", () => {

    const testMeddelande = {
        meddelande: "test"
    }

    test("Testar svaret om man inte specificerar metod", () => {
        const forvantatObjekt = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                meddelande: "test"
            })
        }
        expect(new SetFetchOptions(testMeddelande)).toEqual(forvantatObjekt)
    })

    test("Testar svaret om man skickar med 'POST'", () => {
        const forvantatObjekt = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                meddelande: "test"
            })
        }
        expect(new SetFetchOptions(testMeddelande, "POST")).toEqual(forvantatObjekt)
    })

    test("Att det blir error när man inte ger ett objekt som första", () => {
        expect(() => {
            //måste "slå in den" i en funk för att throw-kollen ska funka
            new SetFetchOptions("test")
        }).toThrow()
    })
})