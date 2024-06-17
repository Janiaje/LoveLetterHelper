const Card = Object.freeze({
    Princess: {
        minPlayerCount: 1,
        count: 1,
        score: 8,
        backgroundPositionX: "-700%"
    },
    Countess: {
        minPlayerCount: 1,
        count: 1,
        score: 7,
        backgroundPositionX: "-600%"
    },
    King: {
        minPlayerCount: 1,
        count: 1,
        score: 6,
        backgroundPositionX: "-500%"
    },
    Prince: {
        minPlayerCount: 1,
        count: 2,
        score: 5,
        backgroundPositionX: "-400%"
    },
    Handmaid: {
        minPlayerCount: 1,
        count: 2,
        score: 4,
        backgroundPositionX: "-300%"
    },
    Baron: {
        minPlayerCount: 1,
        count: 2,
        score: 3,
        backgroundPositionX: "-200%"
    },
    Priest: {
        minPlayerCount: 1,
        count: 2,
        score: 2,
        backgroundPositionX: "-100%"
    },
    Guard: {
        minPlayerCount: 1,
        count: 5,
        score: 1,
        backgroundPositionX: ""
    },
    Bishop: {
        minPlayerCount: 5,
        count: 1,
        score: 9,
        backgroundPositionX: "-1300%"
    },
    "Dowager Queen": {
        minPlayerCount: 5,
        count: 1,
        score: 7,
        backgroundPositionX: "-1000%"
    },
    Constable: {
        minPlayerCount: 5,
        count: 1,
        score: 6,
        backgroundPositionX: "-1400%"
    },
    Count: {
        minPlayerCount: 5,
        count: 2,
        score: 5,
        backgroundPositionX: "-1700%"
    },
    Sycophant: {
        minPlayerCount: 5,
        count: 2,
        score: 4,
        backgroundPositionX: "-1600%"
    },
    Baroness: {
        minPlayerCount: 5,
        count: 2,
        score: 3,
        backgroundPositionX: "-1800%"
    },
    Cardinal: {
        minPlayerCount: 5,
        count: 2,
        score: 2,
        backgroundPositionX: "-1900%"
    },
    Guard2: {
        minPlayerCount: 5,
        count: 3,
        score: 1,
        backgroundPositionX: "-1100%"
    },
    Jester: {
        minPlayerCount: 5,
        count: 1,
        score: 0,
        backgroundPositionX: "-1500%"
    },
    Assassin: {
        minPlayerCount: 5,
        count: 1,
        score: 0,
        backgroundPositionX: "-1200%"
    }
})

function getPlayerCount() {
    return document.querySelectorAll(".discardcontent").length
}

let discardedCardSelector = ".discardcontent"
let currentCardSelector = ".playertable_S"

function gatherCards(selector) {
    let playedCards = Array.from(document.querySelectorAll(`${selector} .stockitem`))
        .map(it => it.style.backgroundPositionX)
        .map(position => Object.entries(Card).find(card => card[1].backgroundPositionX === position))
        .groupBy(it => it[0])

    playedCards = Object.entries(playedCards).map(it => {
        it[1] = it[1].length
        return it
    })

    return Object.fromEntries(playedCards)
}

function gatherPlayedCards() {
    return gatherCards(discardedCardSelector)
}

function gatherCardsFromPlayersHand() {
    return gatherCards(currentCardSelector)
}

function computeRemainingCards(playedCards) {
    let playerCount = getPlayerCount();
    let remainingCards = Object.entries(Card)
        .filter(it => playerCount >= it[1].minPlayerCount)
        .map(it => {
            let count = it[1].count - (playedCards[it[0]] ?? 0)
            return [it[1].score, count]
        })
        .groupBy(it => it[0])

    return Object.entries(remainingCards)
        .map(it => {
            let remainingCount = it[1].reduce((acc, it) => acc + it[1], 0)
            return {label: it[0], value: remainingCount}
        })
}

function drawBarChart(data) {
    const maxBarLength = 20
    const maxDataValue = Math.max(...data.map(item => item.value))
    const overallCount = data.reduce((acc, it) => acc + it.value, 0)

    let chart = data
        .map(item => {
            const barLength = Math.floor((item.value / maxDataValue) * maxBarLength)
            const bar = '█'.repeat(barLength)
            let possibility = Math.floor(item.value / overallCount * 100)
            possibility = possibility.toString().padStart(2, ' ')
            return `(${item.label}) | ${possibility}% | ${bar}${item.value > 0 ? " " : ""}${item.value}`
        })
        .join("\n")

    console.log("Remaining cards:\n(counting the ones in your hand too)\n" + chart)
}

function attachObserver() {
    // Target the element to observe
    const logsElement = document.getElementById('logs')

    // Specify what to observe (attributes, childList, subtree, etc.)
    const config = {childList: true}

    // Create a MutationObserver instance
    const observer = new MutationObserver(() => updateCallback())

    // Start observing the target element
    observer.observe(logsElement, config)

    // Run callback before first observer call
    updateCallback()
}

function updateCallback() {
    console.clear()
    let playedCards = gatherPlayedCards()
    let currentCards = gatherCardsFromPlayersHand()

    Object.entries(currentCards).forEach((card) => {
        playedCards[card[0]] = (playedCards[card[0]] ?? 0) + card[1]
    })

    let remainingCards = computeRemainingCards(playedCards)

    drawBarChart(remainingCards)
}

attachObserver()
