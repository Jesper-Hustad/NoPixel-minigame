AddEventHandler('open:minigame', function(callback)
    Callbackk = callback
    openHack()
end)

RegisterNUICallback('callback', function(data, cb)
    closeHack()
    callback(data.success)
    cb('ok')
end)

function openHack() {
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "open"
    })
}

function closeHack() {
    SetNuiFocus(false, false)
}
