import * as BUI from "@thatopen/ui";
import { GenerateWorld } from "./generateWorld";
import { InitIfLoader } from "./ifLoader";

const standardWorld = new GenerateWorld();
const ifLoader = new InitIfLoader(standardWorld);

const loadIfc = async () => {
  await ifLoader.loadIfc(
    "http://127.0.0.1:5500/models/240717MAD03-STRC-DH-TEC-R24.ifc"
  );
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

BUI.Manager.init();

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
  <bim-panel active label="IFC Loader Tutorial" class="options-menu">
    <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 12px;">
     
        <bim-button label="Load IFC"
          @click="${async () => {
            await loadIfc();
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
