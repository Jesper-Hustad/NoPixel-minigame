--[[ local IsHacking = false

AddEventHandler('open:minigame', function(callback)
    Callbackk = callback
    openHack()
end)

function OpenHackingGame(callback)
    Callbackk = callback
    openHack()
end

RegisterNUICallback('callback', function(data, cb)
    closeHack()
    Callbackk(data.success)
    cb('ok')
end)

function openHack()
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "open"
    })
    IsHacking = true
end

function closeHack()
    SetNuiFocus(false, false)
    IsHacking = false
end

function GetHackingStatus()
    return IsHacking
end ]]


local successCb
local failCb
local resultReceived = false

RegisterNUICallback('callback', function(data, cb)
    SetNuiFocus(false, false)
    resultReceived = true
    if data.success then
        successCb()
    else
        failCb()
    end
    cb('ok')
end)

RegisterCommand('hack', function(source, args)
    -- Please check the parameters below for exports
    exports["hacking"]:hacking(
    function() -- success
        print("success")
    end,
    function() -- failure
        print("failure")
    end)
end)

exports('hacking', function(success, fail)
    resultReceived = false
    successCb = success
    failCb = fail
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "open"
    })
end)