let debug = false;
const hloiVer="0.5.0";

const color1='color: #7bf542';  //bright green
const color2='color: #d8eb34'; //yellow green
const color3='color: #ffffff'; //white
const color4='color: #cccccc'; //gray
const color5='color: #ff0000'; //red


Hooks.on('ready', async function() {
  if (game.system.id!="pf2e")
  {
    console.log("%cHLO Importer | %cWrong game system. %cNot enabling.",color1,color5,color4);
  } else {
    console.log("%cHLO Importer | %cinitializing",color1,color4);
      game.settings.register('hlo-importer', 'userToken', {
          name : "User Token (optional)",
          hint : "Please enter your personal user token. A user token allows external tools (like this one) to access the HLO server and perform export operations.",
          scope : 'world',
          config : true,
          type : String,
          default : '',
          onChange: value =>  location.reload()
      });
      game.settings.register('hlo-importer', 'debugEnabled', {
          name : "Enable debug mode",
          hint : "Debug output will be written to the js console.",
          scope : 'world',
          config : true,
          type: Boolean,
          default: false,
          onChange: value =>  location.reload()
      });
  }
});

Hooks.on('renderActorSheet', function(obj, html){
  if (game.system.id!="pf2e")
  {
    console.log("%cHLO Importer | %cWrong game system. %cNot adding HLO button to actor sheet.",color1,color5,color4);
  } else {
    // Only inject the link if the actor is of type "character" and the user has permission to update it
      const actor = obj.actor;
      if (debug)
        console.log("%cHLO Importer | %cPF2e System Version: hlo-importer actor type: " + actor.data.type,color1,color4)    
        console.log("%cHLO Importer | %cCan user modify: " + actor.canUserModify(game.user, "update"),color1,color4)
      if (!actor.data.type === "character") return;
      if (actor.canUserModify(game.user, "update")==false) return;
      
      let element = html.find(".window-header .window-title");
      if (element.length != 1) return;
      
        let button = $(`<a class="popout" style><i class="fas fa-flask"></i>HLO</a>`);
        let userToken = game.settings.get('hlo-importer', 'userToken')
        if (debug)
          console.log("%cHLO Importer | %chlo-importer token: "+ userToken,color1,color4)
        button.on('click', () => beginHLOImport(obj.object,userToken));
        element.after(button);
    }
  }
);
  
function beginHLOImport(targetActor,userToken){
  let applyChanges=false;
  new Dialog({
    title: `Herolab Online Import`,
    content: `
      
      <div>
        <p>Step 1: Get the character token by clicking on the kebab menu (<strong>⋮</strong>) on any character on your account. Scroll down to "Element Token" and click the <strong>Get Element Token</strong> button. Click the <strong>Copy to Clipboard</strong> button.</p>
        <p>Step 2: Paste the Element Token from the Herolab Online export dialog below</p>
        <br>
        <p>Please note - items which cannot be matched to the Foundry database will not be imported!<p>
      <div>
      <hr/>
      <div id="divCode">
        Enter the element token of the character you wish to import<br>
        <div id="divOuter">
          <div id="divInner">
            <input id="textBoxElementID" type="text" maxlength="14" />
          </div>
        </div>
      </div>
      <br><br><strong>Once you click Import, please be patient as the process might take up to 45 seconds to complete.</strong><br><br>
      <style>
      
        #textBoxElementID {
            border: 0px;
            padding-left: 5px;
            letter-spacing: 2px;
            width: 330px;
            min-width: 330px;
          }
          
          #divInner{
            left: 0;
            position: sticky;
          }
          
          #divOuter{
            width: 285px; 
            overflow: hidden;
          }
  
          #divCode{  
            border: 1px solid black;
            width: 300px;
            margin: 0 auto;
            padding: 5px;
          }
  
      </style>
      `,
    buttons: {
      yes: {
        icon: "<i class='fas fa-check'></i>",
        label: `Import`,
        callback: () => applyChanges = true
      },
      no: {
        icon: "<i class='fas fa-times'></i>",
        label: `Cancel`
      },
    },
    default: "yes",
    close: html => {
      if (applyChanges) {
         
         let HLOElementID= html.find('[id="textBoxElementID"]')[0].value;
 
         convertHLOCharacter(targetActor, HLOElementID,userToken);
  
      }
    }
  }).render(true);

}

function convertHLOCharacter(targetActor, HLOElementID, userToken){
    const pf2eVersion=game.data.system.data.version;
    let error=false
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let responseJSON = JSON.parse(this.responseText);
        if (debug) 
            console.log("%cHLO Importer | %c"+responseJSON,color1,color4);
        if (responseJSON.hasOwnProperty("error")) {
          if (debug)
             console.log("%cHLO Importer | %cerror found in response",color1,color4)
          error=true
        }
        else
          if (debug)
            console.log("%cHLO Importer | %c"+Object.keys(responseJSON.characterData).length,color1,color4)

        if (error){
          new Dialog({
            title: `Herolab Online Import`,
            content: `
                 <div>
                    <h3>Error</h3>
                    <p>${responseJSON.error}<p>
                 </div><br>`,
            buttons: {
              yes: {
                icon: "<i class='fas fa-check'></i>",
                label: `Ok`              }
            },
            default: "yes"
          }).render(true);
        }
        else {
          if (Object.keys(responseJSON.characterData).length>1){
            if (debug)
              console.log("%cHLO Importer | %cCalling checkHLOCharacterIsCorrect",color1,color4)
            checkHLOCharacterIsCorrect(targetActor, responseJSON);
          } else {
            ui.notifications.warn("Unable to convert. Please file a bug with the Conversion ID: " + responseJSON.ConversionID);
            return;
        }
      }
        
      // console.log("%cHLO Importer | %creadyState: "+this.readyState,color1,color4)
      }
    };
    console.log("%cHLO Importer | %cusertoken: " + userToken,color1,color4)
    console.log("%cHLO Importer | %cPF2e System Version: " + pf2eVersion,color1,color4)
    if (userToken == "")
      xmlhttp.open("GET", "https://www.pf2player.com/foundrymodule.php?elementID="+encodeURIComponent(HLOElementID)+"&pf2e="+pf2eVersion+"&hloi="+hloiVer, true);
    else
      xmlhttp.open("GET", "https://www.pf2player.com/foundrymodule.php?elementID="+encodeURIComponent(HLOElementID)+"&pf2e="+pf2eVersion+"&hloi="+hloiVer+"&userToken="+encodeURIComponent(userToken), true);
    xmlhttp.send();

}

function checkHLOCharacterIsCorrect(targetActor,responseJSON){
  if (debug){
    console.log("%cHLO Importer | %cin checkHLOCharacterIsCorrect",color1,color4)
    console.log("%cHLO Importer | %c"+responseJSON,color1,color4)
  }
  let correctCharacter = false;
  charImport = responseJSON.characterData
  conversionData=responseJSON.conversionData
  new Dialog({
    title: charImport.name,
    content: `
      <div><h2>Conversion Log:<br>`+responseJSON.conversionData+`</div><br><div><strong>Continue importing `+charImport.name+`, level `+charImport.data.details.level.value+` `+charImport.data.details.class.value+`?</strong></div><br><br>
      `,
    buttons: {
      yes: {
        icon: "<i class='fas fa-check'></i>",
        label: `Proceed`,
        callback: () => correctCharacter = true
      },
      no: {
        icon: "<i class='fas fa-times'></i>",
        label: `Cancel`
      },
    },
    default: "yes",
    close: html => {
      if (correctCharacter) {
        importHLOCharacter(targetActor, charImport);
      }
    }
  }).render(true);

  
}

async function importHLOCharacter(targetActor, charImport){
  
  importPCID=new RegExp(charImport._id, "g")
  targetPCID=targetActor.data._id
  charDataStr=JSON.stringify(charImport)
  charDataStr=charDataStr.replace(importPCID,targetPCID)
  charImport=JSON.parse(charDataStr)
  console.log("%cHLO Importer | %c Importing "+charImport.name,color1,color4)  
  targetActor.importFromJSON(JSON.stringify(charImport))
}
