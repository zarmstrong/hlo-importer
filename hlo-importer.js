// its a single page as I've been testing it in macros.

Hooks.on('renderActorSheet', function(obj, html){

    let element = html.find(".window-header .window-title");
    if (element.length != 1) return;
  
    let button = $(`<a class="popout" style><i class="fas fa-book"></i>Import from HLO</a>`);
    button.on('click', () => beginHLOImport(obj.object));
    element.after(button);
    }
     
  );
  
  function beginHLOImport(targetActor){
  
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
   
           convertHLOCharacter(targetActor, HLOElementID);
    
        }
      }
    }).render(true);
  
  }
  
  function convertHLOCharacter(targetActor, buildID){
  
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          let responseJSON = JSON.parse(this.responseText);
          console.log(responseJSON);
          console.log(Object.keys(responseJSON.characterData).length)
          if (Object.keys(responseJSON.characterData).length>1){
            checkCharacterIsCorrect(targetActor, responseJSON);
          } else {
            ui.notifications.warn("Unable to convert. Please file a bug with the Conversion ID: " + responseJSON.ConversionID);
            return;
          }
          
        }
      };
      xmlhttp.open("GET", "https://www.pf2player.com/foundrymodule.php?elementID="+encodeURIComponent(buildID), true);
      xmlhttp.send();
  
  }
  
  function checkCharacterIsCorrect(targetActor,responseJSON){
  
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
          importCharacter(targetActor, charImport);
        }
      }
    }).render(true);
  
    
  }
 
  async function importCharacter(targetActor, charImport){
    console.log(charImport)  
    targetActor.importFromJSON(JSON.stringify(charImport))
  }