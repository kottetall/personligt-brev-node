async function taEmotData(route) {
    const data = await fetch(route)
    console.log(data)

    const json = await data.json()
    console.log(json)
}