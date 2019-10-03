module.exports = {

    arBaraNummer(nummer) {
        //kollar om strängen enbart innehåller "nummer" genom att skicka "falskt" om den hittar något som inte är ett nummer
        const regex = /\D/
        return !regex.test(nummer)
    }

}