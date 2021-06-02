# Hack minigame FiveM build
Because of our great contributors there is now a FiveM version.

## ⚠ STILL IN ALPHA ⚠  
This version has just recently been released and is still being worked on. Excpect bugs!  
Do you have knowledge with FiveM? Improve the code and your changes will happily be added.  



## Getting started
1. Download the folder `hacking` trough git or [here](https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/Jesper-Hustad/NoPixel-minigame/tree/main/fivem-script/hacking)  
2. Drop it into your FiveM server in `server\resources\`
3. Implement the hack in your client-side lua file using the `open:minigame` trigger.


## Example implementation
Use the Success boolean variable.  
In this example implementation the outcome is written out in the chat.
```lua
TriggerEvent('open:minigame', function(Success)
    TriggerEvent('chat:addMessage', {
    color = { 255, 0, 0},
    multiline = true,
    args = {"Me", "Hack: " .. (Success and "passed" or "failed")}
    })
end)
```


## FiveM documentation
Read about scripts in FiveM from the [FiveM Docs](https://docs.fivem.net/docs/scripting-manual/introduction/introduction-to-resources/).
