require('./renderer.js');
const $ = require('jQuery')
const electron = require('electron')
const {ipcRenderer} = electron
const io = require('socket.io')

ipcRenderer.on('salvageAll', () =>{
    let allWindows = $('webview')
    for(let i = 0; i < allWindows.length; i++){
        allWindows[i].getWebContents().webContents.executeJavaScript("window.__emitSocket('item:salvageall', {})");
    }
})

ipcRenderer.on('freePull', () =>{
    let allWindows = $('webview')
    for(let i = 0; i < allWindows.length; i++){
        allWindows[i].getWebContents().webContents.executeJavaScript('window.discordGlobalCharacter').then(
            (prom)=>{
                let nextFreeAt = prom.$premiumData.gachaFreeRolls["Astral Gate"]
                console.log(`current time: ${Date.now()}`)
                console.log(`next free at: ${nextFreeAt}`)
                if(nextFreeAt <= Date.now())
                {
                    allWindows[i].getWebContents().webContents.executeJavaScript("window.__emitSocket('astralgate:roll', {numRolls: 10})");
                }
                else{
                    console.log('Astral gate not ready!')
                }
            }, 
            () => { console.log('Promise failed to load') 
        })
    }
})

ipcRenderer.on('donateAllGold', () =>{
    let allWindows = $('webview')
    for(let i = 0; i < allWindows.length; i++){
        allWindows[i].getWebContents().webContents.executeJavaScript('window.discordGlobalCharacter').then(
            (prom)=>{
                allWindows[i].getWebContents().webContents.executeJavaScript(`window.__emitSocket('pet:takegold', {})`);
                allWindows[i].getWebContents().webContents.executeJavaScript(`window.__emitSocket('guild:donateresource', {resource: 'gold', amount: ${prom.gold}})`);

            }, 
            () => { console.log('Promise failed to load') })
    }
})

ipcRenderer.on('startGoldFestival', ()=>{
    let allWindows = $('webview')
    for(let i = 0; i < allWindows.length; i++){
        allWindows[i].getWebContents().webContents.executeJavaScript('window.discordGlobalCharacter').then(
            (prom)=>{
                allWindows[i].getWebContents().webContents.executeJavaScript(`window.__emitSocket('premium:festival', {festivalType:'Gold', duration:72})`);
            }, 
            () => { console.log('Promise failed to load') })
    }
})

ipcRenderer.on('upgradePet', ()=>{
    let allWindows = $('webview')
    for(let i = 0; i < allWindows.length; i++){
        allWindows[i].getWebContents().webContents.executeJavaScript('window.discordGlobalCharacter').then(
            (prom)=>{
                setTimeout(()=> {allWindows[i].getWebContents().webContents.executeJavaScript(`window.__emitSocket('pet:takegold', {})`)}, 200)
                setTimeout(()=> {allWindows[i].getWebContents().webContents.executeJavaScript(`window.__emitSocket('pet:ascend', {})`)}, 1200)
                setTimeout(()=> {allWindows[i].getWebContents().webContents.executeJavaScript(`window.__emitSocket('pet:upgrade', {petUpgrade:'goldStorage'})`)}, 2200)
                setTimeout(()=> {allWindows[i].getWebContents().webContents.executeJavaScript(`window.__emitSocket('pet:upgrade', {petUpgrade:'battleJoinPercent'})`)}, 3200)
                setTimeout(()=> {allWindows[i].getWebContents().webContents.executeJavaScript(`window.__emitSocket('pet:upgrade', {petUpgrade:'gatherTime'})`)}, 4200)
                setTimeout(()=> {allWindows[i].getWebContents().webContents.executeJavaScript(`window.__emitSocket('pet:upgrade', {petUpgrade:'itemFindQualityBoost'})`)}, 5200)
                setTimeout(()=> {allWindows[i].getWebContents().webContents.executeJavaScript(`window.__emitSocket('pet:upgrade', {petUpgrade:'itemFindLevelBoost'})`)}, 6200)
                setTimeout(()=> {allWindows[i].getWebContents().webContents.executeJavaScript(`window.__emitSocket('pet:upgrade', {petUpgrade:'itemFindLevelPercent'})`)}, 7200)
                setTimeout(()=> {allWindows[i].getWebContents().webContents.executeJavaScript(`window.__emitSocket('pet:upgrade', {petUpgrade:'ilpGatherQuantity'})`)}, 8200)
                setTimeout(()=> {allWindows[i].getWebContents().webContents.executeJavaScript(`window.__emitSocket('pet:upgrade', {petUpgrade:'strongerSoul'})`)}, 9200)
                setTimeout(()=> {allWindows[i].getWebContents().webContents.executeJavaScript(`window.__emitSocket('pet:upgrade', {petUpgrade:'soulShare'})`)}, 10200)
            }, 
            () => { console.log('Promise failed to load') })
    }
})

ipcRenderer.on('useAllScrolls', () =>{
    let allWindows = $('webview')
    for(let i = 0; i < allWindows.length; i++){
        allWindows[i].getWebContents().webContents.executeJavaScript('window.discordGlobalCharacter').then(
            (prom)=>{
                let delay = 200
                let currentScrolls = prom.$inventoryData.buffScrolls
                currentScrolls.forEach(element => {
                    setTimeout(allWindows[i].getWebContents().webContents
                    .executeJavaScript(`window.__emitSocket('item:buffscroll', {scrollId: '${element.id}'})`), delay)
                        delay += 1000
                })
            }, 
            () => { console.log('Promise failed to load') })
    }
})

ipcRenderer.on('optimizeEquipment', (event, targetStat)=>{
    let allWindows = $('webview')
    for(let i = 0; i < allWindows.length; i++){
        allWindows[i].getWebContents().webContents.executeJavaScript('window.discordGlobalCharacter').then(
            (prom)=>{
                let delay = 200
                console.log(`target stat is ${targetStat}`)
                let currentEquipment = prom.$inventoryData.equipment
                let currentInventory = prom.$inventoryData.items
                currentInventory.forEach(element => {
                    let slot = element.type
                    let newItemStat = element.stats[targetStat] || 0
                    let oldItemStat = currentEquipment[slot].stats[targetStat] || 0
                    if (newItemStat > oldItemStat)
                    {
                        console.log(`Need to equip!`)
                        setTimeout(allWindows[i].getWebContents().webContents
                        .executeJavaScript(`window.__emitSocket('item:equip', {itemId: '${element.id}'})`), delay)
                        delay += 1000
                    }
                })
            }, 
            () => { console.log('Promise failed to load') })
    }
})
