function rensaLokalTestAnvandare() {
    if (window.confirm("Vill du verkligen radera datan som finns sparad?")) {
        anvandare.clear()
        location.reload()
        alert("Datan är raderad")
    } else {
        alert("Du valde att avbryta")
    }
}

function skapaLokalTestAnvandare() {
    const namn = prompt("Vad är namnet på testanvändaren?") || "test"
    const anvandare = new User()
    anvandare.create(namn)
    anvandare.saveLocal()
    location.reload()
}