function payment_callback(res) {
    //PayNano.close()
    postInputs(res.hash)
    $("#signup").hide()
    $("#confirmation").show()
}

function onReturn() {
    console.log("returned")
}

function callInvoice() {
    PayNano.render({
        amount: "0.0001",
        onPay: payment_callback,
        onReturn: onReturn
    })
}
document.getElementById("button-confirm").addEventListener("click", callInvoice, false)


let nicknameOkay = false
let nanoAddressOkay = false

const isInputsOk = () => nicknameOkay && nanoAddressOkay ? $('#button-confirm').attr('disabled', false) : $('#button-confirm').attr('disabled', true)

$('#input-nano-address').on('input', function () {
    const val = $(this).val()
    if (val == "") {
        nanoAddressOkay = false
        return $(".input-group-account").removeClass("error").removeClass("ok")
    }
    if (isNanoAddress(val)) {
        nanoAddressOkay = true
        $(".input-group-account").removeClass("error").addClass("ok")
    } else {
        nanoAddressOkay = false
        $(".input-group-account").removeClass("ok").addClass("error")
    }
    isInputsOk()
})

$('#input-nickname').on('input', function () {
    const val = $(this).val()
    if (val == "") {
        nicknameOkay = false
        $(".input-group-nickname").removeClass("error").removeClass("ok")
        $(".input-group-nickname button i").removeClass("bi-person-check-fill").removeClass("bi-person-dash-fill").addClass("bi-person-fill")
        return
    }
    if (val.length >= 4 && val.length < 20 && /^([a-zA-Z0-9_.-]+)$/.test(val)) {
        nicknameOkay = true
        $(".input-group-nickname").removeClass("error").addClass("ok")
        $(".input-group-nickname button i").removeClass("bi-person-fill").removeClass("bi-person-dash-fill").addClass("bi-person-check-fill")
    } else {
        nicknameOkay = false
        $(".input-group-nickname").removeClass("ok").addClass("error")
        $(".input-group-nickname button i").removeClass("bi-person-fill").removeClass("bi-person-check-fill").addClass("bi-person-dash-fill")
    }
    isInputsOk()
})

inputNumber($('.input-number'), $('.input-number-decrement'), $('.input-number-increment'));