
const postInputs = (hash) => {
    const nickname = document.getElementById("input-nickname").value
    const address = document.getElementById("input-nano-address").value
    const price = document.getElementById("input-price-guess").value
    console.log(`${nickname} ${address} ${price}`)
    postJSON("/api/create", { nickname, address, price, hash })
        .then(console.log)
        .catch(console.error)
}

function loadGuessesTable() {
    function addGuessItem(position, nick, price) {
        const blockCell = document.createElement("tr")
        blockCell.innerHTML = '\
                <td class="position">' + position + '⁰</td> \
                <td class="nick">' + nick + '</td> \
                <td class="price">' + price + '</td>'
        document.querySelector("#guessesTable tbody").append(blockCell)
    }

    getJSON("http://localhost:3333/api/read")
        .then((res) => {
            res.forEach((guess) => addGuessItem(guess.id, guess.nickname, guess.price))
            getPagination("#guessesTable")
            $('#maxRows').trigger('change');
        })
        .catch((err) => {
            alert("fail loading table")
            console.log(err)
        })
}


const upgradeTime = 20 * 24 * 60 * 60;
let seconds = upgradeTime;
function timer() {
    const days = Math.floor(seconds / 24 / 60 / 60);
    const hoursLeft = Math.floor((seconds) - (days * 86400));
    const hours = Math.floor(hoursLeft / 3600);
    const minutesLeft = Math.floor((hoursLeft) - (hours * 3600));
    const minutes = Math.floor(minutesLeft / 60);
    const remainingSeconds = seconds % 60;

    const pad = (n) => n < 10 ? "0" + n : n

    document.getElementById("ending-days").innerText = pad(days)
    document.getElementById("ending-hours").innerText = pad(hours)
    document.getElementById("ending-minutes").innerText = pad(minutes)
    document.getElementById("ending-seconds").innerText = pad(remainingSeconds)

    if (seconds == 0) {
        clearInterval(countdownTimer);
        document.getElementById('countdown').innerHTML = "Completed";
    } else {
        seconds--;
    }
}

function updateNanoPrice(callback) {

    getJSON("https://api.binance.com/api/v3/ticker/24hr?symbol=NANOUSDT")
        .then(res => {
            console.log(res)
            callback(res.askPrice)
        })
        .catch(console.error)

    if ("WebSocket" in window) {
        var ws = new WebSocket("wss://stream.binance.com:9443/ws/nanousdt@miniTicker")

        ws.onopen = function () {
            console.log("Binance connected...");
        };

        ws.onmessage = function (evt) {
            var r_msg = evt.data;
            var jr_msg = JSON.parse(r_msg);
            console.log(jr_msg)
            callback(jr_msg.c)
        }

        ws.onclose = function () {
            console.log("Binance disconnected");
        }
    } else {
        alert("WebSocket is NOT supported");
    }
}