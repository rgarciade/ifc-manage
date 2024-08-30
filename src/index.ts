import * as BUI from "@thatopen/ui";
import { GenerateWorld } from "./generateWorld";
import { InitIfLoader } from "./ifLoader";
import { FragmentsGroup } from "@thatopen/fragments";
import * as CUI from "@thatopen/ui-obc";

const standardWorld = new GenerateWorld();
const ifLoader = new InitIfLoader(standardWorld);
let lastModel: FragmentsGroup;

const loadIfc = async (file: string) => {
  lastModel = await ifLoader.loadIfc(
    `http://127.0.0.1:5500/models/${file}.ifc`
  );
  standardWorld.addModel(lastModel);
};

const download = (file: File) => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const exportFragments = () => {
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
};

function disposeFragments() {
  ifLoader.fragments.dispose();
}

// function fitLastModel(){
//   const fragmentBbox = components.get(OBC.BoundingBoxer);
// fragmentBbox.add(lastModel;
// }

BUI.Manager.init();

// const panel = BUI.Component.create(() => {
//   const [loadIfcBtn] = CUI.buttons.loadIfc({
//     components: standardWorld.components,
//   });

//   return BUI.html`
//    <bim-panel label="Classifications Tree">
//     <bim-panel-section label="Importing">
//       ${loadIfcBtn}
//     </bim-panel-section>
//     <bim-panel-section label="Classifications">
//       ${ifLoader.classificationsTree}
//     </bim-panel-section>
//    </bim-panel>
//   `;
// });
//document.body.append(panel);

const viewport = document.createElement("bim-viewport");
viewport.name = "viewer";
const panel = BUI.Component.create<BUI.PanelSection>(() => {
  const [loadIfcBtn] = CUI.buttons.loadIfc({
    components: standardWorld.components,
  });
  return BUI.html`
  <bim-panel active label="IFC Loader Tutorial" class="options-menu">
    <bim-panel-section collapsed label="Charge ifc">
      <bim-panel-section style="padding-top: 12px;">

        <bim-button label="Load small 1 710KB IFC"
          @click="${async () => {
            await loadIfc(`01`);
          }}">
        </bim-button>
        <bim-button label="Load small 2 56M IFC"
          @click="${async () => {
            await loadIfc(`02`);
          }}">
        </bim-button>
        <bim-button label="Load small 3 15,2M IFC"
          @click="${async () => {
            await loadIfc(`03`);
          }}">
           </bim-button>
        <bim-button label="Load 240717MAD03-STRC-DH-TEC-R24 19M IFC"
          @click="${async () => {
            await loadIfc(`240717MAD03-STRC-DH-TEC-R24`);
          }}">
        </bim-button>
        <bim-button label="Load BSA1X - bausa 13-15 240122 431M IFC"
          @click="${async () => {
            await loadIfc(`BSA1X - bausa 13-15 240122`);
          }}">
        </bim-button>
         <bim-button label="Fit last model"
          @click="${() => {
            standardWorld.fitLastModel();
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
         <bim-button label="active culler"
          @click="${() => {
            ifLoader.toggleCuller();
          }}">
        </bim-button>

      </bim-panel-section>
      <bim-panel-section label="Classifications">
        ${ifLoader.classificationsTree}
      </bim-panel-section>
    </bim-panel>
  `;
});
const app = document.createElement("bim-grid");
app.layouts = {
  main: {
    template: `
      "panel viewport"
      / 23rem 1fr
    `,
    elements: { panel, viewport: viewport },
  },
};

app.layout = "main";
document.body.append(panel);

/* MD
  And we will make some logic that adds a button to the screen when the user is visiting our app from their phone, allowing to show or hide the menu. Otherwise, the menu would make the app unusable.
*/

// const button = BUI.Component.create<BUI.PanelSection>(() => {
//   return BUI.html`
//       <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
//         @click="${() => {
//           if (panel.classList.contains("options-menu-visible")) {
//             panel.classList.remove("options-menu-visible");
//           } else {
//             panel.classList.add("options-menu-visible");
//           }
//         }}">
//       </bim-button>
//     `;
// });

// document.body.append(button);
