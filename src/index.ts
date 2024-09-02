import * as BUI from "@thatopen/ui";
import { GenerateWorld } from "./generateWorld";
import { InitIfLoader } from "./ifLoader";
import { FragmentsGroup } from "@thatopen/fragments";
import {rightPanel} from "./ui/rightPanel";

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
debugger;
BUI.Manager.init();
new rightPanel([
    {
        label: 'FC Loader Tutorial',
        collapsed: false,
        elements: [
            {
                type: 'button',
                label: 'Load small 1 710KB IFC',
                function: () => loadIfc(`01`),
            },
            {
                type: 'button',
                label: 'Load small 2 15,2M IFC',
                function: () => loadIfc(`03`),
            },
            {
                type: 'button',
                label: 'Load 240717MAD03-STRC-DH-TEC-R24 19M IFC',
                function: () => loadIfc(`240717MAD03-STRC-DH-TEC-R24`),
            },
            {
                type: 'button',
                label: 'Load BSA1X - bausa 13-15 240122 431M IFC',
                function: () => loadIfc(`BSA1X - bausa 13-15 240122`),
            },
            {
                type: 'button',
                label: 'example project location',
                function: () => loadIfc(`example project location`),
            },
            {
                type: 'button',
                label: 'Load EncofradoVigaPlasencia 837k IFC',
                function: () => loadIfc(`EncofradoVigaPlasencia`),
            }
        ]
    },
    {
        label: 'Actions',
        collapsed: false,
        elements: [
            {
                type: 'button',
                label: 'Fit last model',
                function: () => standardWorld.fitLastModel(),
            },
            {
                type: 'button',
                label: 'Export fragments',
                function: () => exportFragments(),
            },
            {
                type: 'button',
                label: 'Dispose fragments',
                function: () => disposeFragments(),
            },
            {
                type: 'button',
                label: 'active culler',
                function: () => ifLoader.toggleCuller(),
            }
        ]
    },
]);
//
// const panel = BUI.Component.create<BUI.PanelSection>(() => {
//   return BUI.html`
//   <bim-panel active label="IFC Loader Tutorial" class="options-menu">
//     <bim-panel-section collapsed label="Charge ifc">
//       <bim-panel-section style="padding-top: 12px;">
//
//         <bim-button label="Load small 1 710KB IFC"
//           @click="${async () => {
//             await loadIfc(`01`);
//           }}">
//         </bim-button>
//         <bim-button label="Load small 2 15,2M IFC"
//           @click="${async () => {
//             await loadIfc(`03`);
//           }}">
//            </bim-button>
//         <bim-button label="Load 240717MAD03-STRC-DH-TEC-R24 19M IFC"
//           @click="${async () => {
//             await loadIfc(`240717MAD03-STRC-DH-TEC-R24`);
//           }}">
//         </bim-button>
//         <bim-button label="Load BSA1X - bausa 13-15 240122 431M IFC"
//           @click="${async () => {
//             await loadIfc(`BSA1X - bausa 13-15 240122`);
//           }}">
//         </bim-button>
//         <bim-button label="example project location"
//           @click="${async () => {
//             await loadIfc(`example project location`);
//           }}">
//         </bim-button>
//
//         <bim-button label="Load EncofradoVigaPlasencia 837k IFC"
//           @click="${async () => {
//             await loadIfc(`EncofradoVigaPlasencia`);
//           }}">
//         </bim-button>
//          <bim-button label="Fit last model"
//           @click="${() => {
//             standardWorld.fitLastModel();
//           }}">
//         </bim-button>
//
//         <bim-button label="Export fragments"
//           @click="${() => {
//             exportFragments();
//           }}">
//         </bim-button>
//
//         <bim-button label="Dispose fragments"
//           @click="${() => {
//             disposeFragments();
//           }}">
//         </bim-button>
//          <bim-button label="active culler"
//           @click="${() => {
//             ifLoader.toggleCuller();
//           }}">
//         </bim-button>
//
//       </bim-panel-section>
//     </bim-panel>
//   `;
// });
//
// document.body.append(panel);

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

//document.body.append(button);
