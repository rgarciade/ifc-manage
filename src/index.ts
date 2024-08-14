import * as WEBIFC from "web-ifc";
import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";
import { GenerateWorld } from "./generateWorld";

/* MD

  We'll make the background of the scene transparent so that it looks good in our docs page, but you don't have to do that in your app!

*/

//world.scene.three.background = null;

const standardWorld = new GenerateWorld();

/* MD
  ### 🚗🏎️ Getting IFC and fragments
  ---
  When we read an IFC file, we convert it to a geometry called Fragments. Fragments are a lightweight representation of geometry built on top of THREE.js `InstancedMesh` to make it easy to work with BIM data efficiently. All the BIM geometry you see in our libraries are Fragments, and they are great: they are lightweight, they are fast and we have tons of tools to work with them. But fragments are not used outside our libraries. So how can we convert an IFC file to fragments? Let's check out how:
  */

const fragments = standardWorld.components.get(OBC.FragmentsManager);
const fragmentIfcLoader = standardWorld.components.get(OBC.IfcLoader);

/* MD
  :::info Why not just IFC?

  IFC is nice because it lets us exchange data with many tools in the AECO industry. But your graphics card doesn't understand IFC. It only understands one thing: triangles. So we must convert IFC to triangles. There are many ways to do it, some more efficient than others. And that's exactly what Fragments are: a very efficient way to display the triangles coming from IFC files.

  :::

  Once Fragments have been generated, you can export them and then load them back directly, without needing the original IFC file. Why would you do that? Well, because fragments can load +10 times faster than IFC. And the reason is very simple.   When reading an IFC, we must parse the file, read the implicit geometry, convert it to triangles (Fragments) and send it to the GPU. When reading fragments, we just take the triangles and send them, so it's super fast.

  :::danger How to use Fragments?

  If you want to find out more about Fragments, check out the Fragments Manager tutorial.

  :::


  ### 🔭🔧 Calibrating the converter
  ---
  Now, we need to configure the path of the WASM files. What's WASM? It's a technology that lets us run C++ on the browser, which means that we can load IFCs super fast! These files are the compilation of our `web-ifc` library. You can find them in the github repo and in NPM. These files need to be available to our app, so you have 2 options:

  - Download them and serve them statically.
  - Get them from a remote server.

  The easiest way is getting them from unpkg, and the cool thing is that you don't need to do it manually! It can be done directly by the tool just by writing the following:
  */

fragmentIfcLoader.setup();

// If you want to the path to unpkg manually, then you can skip the line
// above and set them manually as below:
// fragmentIfcLoader.settings.wasm = {
//   path: "https://unpkg.com/web-ifc@0.0.56/",
//   absolute: true,
// };

/* MD
  Awesome! Optionally, we can exclude categories that we don't want to convert to fragments like very easily:
*/

const excludedCats = [
  WEBIFC.IFCTENDONANCHOR,
  WEBIFC.IFCREINFORCINGBAR,
  WEBIFC.IFCREINFORCINGELEMENT,
];

for (const cat of excludedCats) {
  fragmentIfcLoader.settings.excludedCategories.add(cat);
}

/* MD
  We can further configure the conversion using the `webIfc` object. In this example, we will make the IFC model go to the origin of the scene (don't worry, this supports model federation):
  */

fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;

/* MD
  ### 🚗🔥 Loading the IFC
  ---
  Next, let's define a function to load the IFC programmatically. We have hardcoded the path to one of our IFC files, but feel free to do this with any of your own files!

 :::info Opening local IFCs

  Keep in mind that the browser can't access the file of your computer directly, so you will need to use the Open File API to open local files.

  :::
*/

async function loadIfc() {
  const file = await fetch("http://127.0.0.1:5500/models/03.ifc");
  const data = await file.arrayBuffer();
  const buffer = new Uint8Array(data);
  const model = await fragmentIfcLoader.load(buffer);
  model.name = "example";
  model.position.set(0, 8.8, 0);
  standardWorld.world.scene.three.add(model);
}

/* MD
  If you want to get the resulted model every time a new model is loaded, you can subscribe to the following event anywhere in your app:
*/

fragments.onFragmentsLoaded.add((model) => {
  console.log(model);
});

/* MD
  ### 🎁 Exporting the result to fragments
  ---
  Once you have your precious fragments, you might want to save them so that you don't need to open this IFC file each time your user gets into your app. Instead, the next time you can load the fragments directly. Defining a function to export fragments is as easy as this:
*/

function download(file: File) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function exportFragments() {
  if (!fragments.groups.size) {
    return;
  }
  const group = Array.from(fragments.groups.values())[0];
  const data = fragments.export(group);
  download(new File([new Blob([data])], "small.frag"));

  const properties = group.getLocalProperties();
  if (properties) {
    download(new File([JSON.stringify(properties)], "small.json"));
  }
}

/* MD
  ### 🧠🧼 Cleaning memory
  ---
  Now, just like in the `FragmentManager` tutorial, you will need to dispose the memory if your user wants to reset the state of the scene, especially if you are using Single Page Application technologies like React, Angular, Vue, etc. To do that, you can simply call the `dispose` method:
*/

function disposeFragments() {
  fragments.dispose();
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
