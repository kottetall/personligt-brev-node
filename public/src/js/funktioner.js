async function taEmotData(route) {
    const data = await fetch(route)
    console.log(data)

    const json = await data.json()
    console.log(json)
}

async function hamtaAnnons() {
    const annonsid = document.querySelector(".annonsid").value || 8448916

    console.log(annonsid)

    const paket = {
        "annonsid": annonsid
    }
    const options = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(paket)
    }

    console.log(options)
    const data = await fetch("/annons", options)
    const json = await data.json()
    console.log(json)
    return json
}