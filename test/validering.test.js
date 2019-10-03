const {
    arBaraNummer
} = require("../custom_modules/validering")

describe("Test av arBaraNummer", () => {
    test("Nummer som sträng", () => {
        expect(arBaraNummer("123456")).toBe(true)
    })
    test("Nummer som ints", () => {
        expect(arBaraNummer(123456)).toBe(true)
    })
    test("Bara bokstäver", () => {
        expect(arBaraNummer("fsdfddf")).toBe(false)
    })
    test("Text och nummer(som sträng) blandat", () => {
        expect(arBaraNummer("4545v531")).toBe(false)
    })
})