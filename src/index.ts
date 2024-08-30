import * as BUI from "@thatopen/ui";
import { GenerateWorld } from "./generateWorld";
import { InitIfLoader } from "./ifLoader";
import { FragmentsGroup } from "@thatopen/fragments";
import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import * as THREE from "three";

const standardWorld = new GenerateWorld();
const ifLoader = new InitIfLoader(standardWorld);
let lastModel: FragmentsGroup;

const loadIfc = async () => {
  lastModel = await ifLoader.loadIfc();
  standardWorld.addModel(lastModel);
  // @ts-ignore
  const navigator = standardWorld.components.get(OBCF.Civil3DNavigator);
  // @ts-ignore
  navigator.world = standardWorld.world;
  // @ts-ignore
  navigator.draw(lastModel);

  const cullers = standardWorld.components.get(OBC.Cullers);
  const culler = cullers.create(standardWorld.world);
  culler.threshold = 10;

  for (const child of lastModel.children) {
    if (child instanceof THREE.InstancedMesh) {
      culler.add(child);
    }
  }

  culler.needsUpdate = true;

  standardWorld.world.camera.controls.addEventListener("sleep", () => {
    culler.needsUpdate = true;
  });
  // @ts-ignore
  const sphere = new THREE.Sphere(undefined, 20);
  // @ts-ignore
  navigator.onHighlight.add(({ point }) => {
    sphere.center.copy(point);
    standardWorld.world.camera.controls.fitToSphere(sphere, true);
  });
};
loadIfc();
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
