import * as BUI from "@thatopen/ui";
import { World } from "./world/world";
import { InitIfLoader } from "./ifLoader";
import { FragmentsGroup } from "@thatopen/fragments";
import {rightPanel} from "./ui/rightPanel";

const definedWorld = new World();
const ifLoader = new InitIfLoader(definedWorld);
let lastModel: FragmentsGroup;

const loadIfc = async (file: string) => {
  lastModel = await ifLoader.loadIfc(
    `http://127.0.0.1:5500/models/${file}.ifc`
  );
  definedWorld.addModel(lastModel);
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
    definedWorld.removeAllModels();
}

BUI.Manager.init();

new rightPanel([
    {
        label: 'temp charge models',
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
                function: () => definedWorld.fitLastModel(),
            },
            {
                type: 'button',
                label: 'Export fragments',
                function: () => exportFragments(),
            },
            {
                type: 'button',
                label: 'remove all models',
                function: () => disposeFragments(),
            },
            {
                type: "button",
                label: "toggle highlighter",
                function: () => definedWorld.toggleHighlighter(),
            },
            {
                type: 'checkbox',
                label: "charge many models",
                checked: true,
                function: () => definedWorld.toggleEnableManyModels(),
            },
            {
                type: 'checkbox',
                label: "active culler 'ned new render'",
                checked: false,
                function: () => {
                   definedWorld.toggleCuller();
                },
            }

        ]
    },
]);

