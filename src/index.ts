import * as BUI from "@thatopen/ui";
import { GenerateWorld } from "./generateWorld";
import {InitIfLoader} from "./ifLoader";


const standardWorld = new GenerateWorld();
const ifLoader = new InitIfLoader(standardWorld);


const  loadIfc = async () =>{
  await ifLoader.loadIfc("http://127.0.0.1:5500/models/03.ifc");
}

function download(file: File) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function exportFragments() {
  if (!ifLoader.fragments.groups.size) {
    return;
  }
  const group = Array.from(ifLoader.fragments.groups.values())[0];
  const data = ifLoader.fragments.export(group);
  download(new File([new Blob([data])], "small.frag"));

  const properties = group.getLocalProperties();
  if (properties) {
    download(new File([JSON.stringify(properties)], "small.json"));
  }
}

function disposeFragments() {
  ifLoader.fragments.dispose();
}

/* MD
  That's it! Congrats, now you can load IFC files into your app, generate the 3D geometry and property data for them and navigate them in 3D. In other tutorials, you'll find tons of tools to work with them and create amazing BIM apps! See you there. 💪

  ### ⏱️ Measuring the performance (optional)
  ---

  We'll use the [Stats.js](https://github.com/mrdoob/stats.js) to measure the performance of our app. We will add it to the top left corner of the viewport. This way, we'll make sure that the memory consumption and the FPS of our app are under control.
*/

// const stats = new Stats();
// stats.showPanel(2);
// document.body.append(stats.dom);
// stats.dom.style.left = "0px";
// stats.dom.style.zIndex = "unset";
// world.renderer.onBeforeUpdate.add(() => stats.begin());
// world.renderer.onAfterUpdate.add(() => stats.end());

/* MD
  ### 🧩 Adding some UI
  ---

  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

/* MD
Now we will add some UI to explode and restore our BIM model, which can be easily done with a checkbox that determines whether a model is exploded or not. For more information about the UI library, you can check the specific documentation for it!
*/

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
  <bim-panel active label="IFC Loader Tutorial" class="options-menu">
    <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 12px;">
      
        <bim-button label="Load IFC"
          @click="${() => {
            loadIfc();
          }}">
        </bim-button>  
            
        <bim-button label="Export fragments"
          @click="${() => {
            exportFragments();
          }}">
        </bim-button>  
            
        <bim-button label="Dispose fragments"
          @click="${() => {
            disposeFragments();
          }}">
        </bim-button>
      
      </bim-panel-section>
      
    </bim-panel>
  `;
});

document.body.append(panel);

/* MD
  And we will make some logic that adds a button to the screen when the user is visiting our app from their phone, allowing to show or hide the menu. Otherwise, the menu would make the app unusable.
*/

const button = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${() => {
          if (panel.classList.contains("options-menu-visible")) {
            panel.classList.remove("options-menu-visible");
          } else {
            panel.classList.add("options-menu-visible");
          }
        }}">
      </bim-button>
    `;
});

document.body.append(button);

/* MD
  ### 🎉 Wrap up
  ---

  That's it! You have created an app that can load IFC files, convert them to 3D fragments and navigate them in 3D. Fantastic job! For bigger IFC files, instead of reading them directly every time, you can store the fragments and properties and load them instead of the original IFC. For even bigger files, you can use streaming, which we also cover in other tutorials!
*/
