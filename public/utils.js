function getJSON(url) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            mpostJsonethod: 'GET',
        }).then(function (response) {
            var contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json().then(function (json) {
                    // process your JSON further
                    resolve(json)
                });
            } else {
                reject({ error: "We haven't got JSON!" });
            }
        }).catch((err) => {
            reject({ error: err });
        });
    })
}

function postJSON(url, data) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(function (response) {
            var contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json().then(function (json) {
                    // process your JSON further
                    resolve(json)
                });
            } else {
                reject({ error: "We haven't got JSON!" });
            }
        }).catch((err) => {
            reject({ error: err });
        });
    })
}

function isNanoAddress(address) {
    return /^(xrb_|nano_)[13][13-9a-km-uw-z]{59}$/.test(address)
}

function hasNanoAddress(content = "") {

    if (!content || typeof content !== 'string') return false;

    if (content.startsWith("nano:")) {
        if (content.length >= 70) {
            const address = content.substring(5, 70)
            if (isNanoAddress(address)) return address
        }
    } else if (content.startsWith("nano_")) {
        const address = content.substring(0, 70)
        if (isNanoAddress(address)) return address
    }

    return false
}

const TunedBigNumber = BigNumber.clone({
    EXPONENTIAL_AT: 1e9,
    DECIMAL_PLACES: 36,
})

const inputNumber = (el, dec, inc) => {

    const min = !isNaN(el.attr('min')) ? TunedBigNumber(el.attr('min')).toString(10) : false;
    const max = !isNaN(el.attr('max')) ? TunedBigNumber(el.attr('max')).toString(10) : false;
    const step = !isNaN(el.attr('step')) ? TunedBigNumber(el.attr('step')).toString(10) : 1;
    
    const decrement = () => {
        if (!min || TunedBigNumber(el[0].value).isGreaterThan(min)) el[0].value = TunedBigNumber(el[0].value).minus(step).decimalPlaces(4).toString(10);
    }
    const increment = () => {
        if (!max ||  TunedBigNumber(el[0].value).isLessThan(max)) el[0].value = TunedBigNumber(el[0].value).plus(step).decimalPlaces(4).toString(10);
    }

    dec.on('click', decrement);
    inc.on('click', increment);
}