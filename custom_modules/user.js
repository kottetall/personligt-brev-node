function UserBase(namn) {
    this.grunduppgifter = {
            kontaktuppgifter: "",
            rubrik: "",
            halsning: "",
            namn: namn
        },

        this.text = {
            om: {},
            egenskaper: {},
            erfarenheter: {},
            kunskaper: {}
        }
}

function test() {
    console.log("testet funkar också")
}

module.exports = {
    UserBase,
    test
}