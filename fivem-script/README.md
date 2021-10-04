# Hack minigame FiveM build
Because of our great contributors there is now a FiveM version.

## ⚠ In Beta ⚠  
This version has been released in beta, but still expect some bugs!
If you find any, please report it as an issue.
Do you have knowledge with FiveM? Improve the code and your changes will happily be added!  



## Getting started
1. Download the folder `hacking` trough git or [here](https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/Jesper-Hustad/NoPixel-minigame/tree/main/fivem-script/hacking)  
2. Drop it into your FiveM server in `server\resources\`
3. Implement the hack in your client-side lua file using the `open:minigame` trigger.

Note: If you want to change the resource name, remember to update the post events in script.js to match the resource name.
## Example implementation
In this example implementation the outcome is written out in the chat.
```lua
exports["hacking"]:hacking(
function() -- success
    TriggerEvent('chat:addMessage', {
        color = { 255, 0, 0},
        multiline = true,
        args = {"Me", "Hack: passed"}
    })
end,
function() -- failure
    TriggerEvent('chat:addMessage', {
        color = { 255, 0, 0},
        multiline = true,
        args = {"Me", "Hack: failed"}
    })
end)
```

## Languages
By going in the `language.js` file located in `fivem-script/hacking/html/src/language.js` you can change the variable `SELECTED_LANGUAGE` to any of the supported languages. Currently the supported languages are `['EN', 'ES', 'IT', 'FR']`. Only the colors are translated. Hopefully we can add more languages and expand the feature, feel free to send a pull request for this feature!

## FiveM documentation
Read about scripts in FiveM from the [FiveM Docs](https://docs.fivem.net/docs/scripting-manual/introduction/introduction-to-resources/).
