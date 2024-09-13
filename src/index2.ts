
import * as THREE from "three";
import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import * as BUI from "@thatopen/ui";

/* MD
  ### 🌎 Setting up a simple scene
  ---

  We will start by creating a simple scene with a camera and a renderer. If you don't know how to set up a scene, you can check the Worlds tutorial. Notice how we use the PostproductionRenderer in this case.
*/




async function ss () {

    /* MD
      ### 🌎 Setting up a simple scene
      ---

      We will start by creating a simple scene with a camera and a renderer. If you don't know how to set up a scene, you can check the Worlds tutorial. Notice how we use the PostproductionRenderer in this case.
    */

    const container = document.getElementById("container")!;

    const components = new OBC.Components();

    const worlds = components.get(OBC.Worlds);

    const world = worlds.create<
        OBC.SimpleScene,
        OBC.OrthoPerspectiveCamera,
        OBCF.PostproductionRenderer
    >();

    world.scene = new OBC.SimpleScene(components);
    world.renderer = new OBCF.PostproductionRenderer(components, container);
    world.camera = new OBC.OrthoPerspectiveCamera(components);

    world.renderer.postproduction.enabled = true;
    world.renderer.postproduction.customEffects.outlineEnabled = true;

    components.init();
    debugger
    await world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

    world.scene.setup();

    const grids = components.get(OBC.Grids);
    grids.config.color.setHex(0x666666);
    const grid = grids.create(world);
    grid.three.position.y -= 1;
    world.renderer.postproduction.customEffects.excludedMeshes.push(grid.three);

    /* MD

      We'll make the background of the scene transparent so that it looks good in our docs page, but you don't have to do that in your app!

    */

    world.scene.three.background = null;

    /* MD
      ### 🧳 Loading a BIM model
      ---

     We'll start by adding a BIM model to our scene. That model is already converted to fragments, so it will load much faster than if we loaded the IFC file.

      :::tip Fragments?

        If you are not familiar with fragments, check out the IfcLoader tutorial!

      :::
    */
    debugger
    const fragments = components.get(OBC.FragmentsManager);

    // const file = await fetch(
    //     "https://thatopen.github.io/engine_components/resources/small.frag",
    // );
    // const data = await file.arrayBuffer();
    // const buffer = new Uint8Array(data);
    // const model = fragments.load(buffer);
    // world.scene.three.add(model);
    //
    // const propsFile = await fetch(
    //     "https://thatopen.github.io/engine_components/resources/small.json",
    // );
    // const propsData = await propsFile.json();
    // model.setLocalProperties(propsData);


    const file = await fetch(
        `http://127.0.0.1:5500/models/big.frag`,
    );
    const data = await file.arrayBuffer();
    const buffer = new Uint8Array(data);
    const model = fragments.load(buffer);
    debugger
    world.scene.three.add(model);
    debugger
    const propsFile = await fetch(
        `http://127.0.0.1:5500/models/big.json`,
    );

    try {
        console.log('a1')
        const propsData = await propsFile.json();
        console.log('a2')
        model.setLocalProperties(propsData);
        console.log('a3')
    }catch (e){
        console.error('Error al cargar las propiedades', e)
    }


    debugger
    /* MD
      ### 🖼️ Getting the plans
      ---

     Now, we will get an instance of the plans component and automatically generate the all the floor plans of the BIM model we just loaded.
    */

    const plans = components.get(OBCF.Plans);
    plans.world = world;
    await plans.generate(model);

    debugger
    /* MD
      ### 🔦 Setting up highlighting
      ---

     Now, let's set up highlighting so that the user can hover and select items on the BIM model.

      :::tip Highlighter?

        If you are not familiar with highlighter, check out its specific tutorial!

      :::
    */

    const highlighter = components.get(OBCF.Highlighter);
    highlighter.setup({ world });

    /* MD
      ### 🐈‍⬛ Setting up culling
      ---

     Now, let's set up culling so that our scene becomes even more efficient.

      :::tip Culling?

        If you are not familiar with culling, check out its specific tutorial!

      :::
    */

    const cullers = components.get(OBC.Cullers);
    const culler = cullers.create(world);
    for (const fragment of model.items) {
        culler.add(fragment.mesh);
    }

    culler.needsUpdate = true;

    world.camera.controls.addEventListener("sleep", () => {
        culler.needsUpdate = true;
    });
    debugger
    /* MD
      ### 🖌️ Defining styles
      ---

     Next, we need to define how we want the floorplans to look like. For that, we'll need to create a bunch of clipping styles, so that the walls and slabs have a thick section line and a filling, whereas the doors and windows have a thin section line. Of course, we also need to classifier to split the model to categories.

       :::tip Clipping? Classifier?

        If you are not familiar with the edges clipper or the classifier, check out that tutorial for more details about it!

      :::

      So let's create both:
    */

    const classifier = components.get(OBC.Classifier);
    const edges = components.get(OBCF.ClipEdges);

    /* MD
      Now we will classify the model by model (to get all entities) and by entity (to split it by IFC category). Then we'll create some groups:
      - All the items in this model.
      - All the walls in this model.
      - All the doors, windows, plates and members in this model.
    */

    classifier.byModel(model.uuid, model);
    classifier.byEntity(model);
    debugger
    const modelItems = classifier.find({ models: [model.uuid] });

    const thickItems = classifier.find({
        entities: ["IFCWALLSTANDARDCASE", "IFCWALL"],
    });

    const thinItems = classifier.find({
        entities: ["IFCDOOR", "IFCWINDOW", "IFCPLATE", "IFCMEMBER"],
    });
    debugger
    /* MD
      Awesome! Now, to create a style called "thick" for the walls, we can do the following:
    */

    const grayFill = new THREE.MeshBasicMaterial({ color: "gray", side: 2 });
    const blackLine = new THREE.LineBasicMaterial({ color: "black" });
    const blackOutline = new THREE.MeshBasicMaterial({
        color: "black",
        opacity: 0.5,
        side: 2,
        transparent: true,
    });

    edges.styles.create(
        "thick",
        new Set(),
        world,
        blackLine,
        grayFill,
        blackOutline,
    );

    for (const fragID in thickItems) {
        const foundFrag = fragments.list.get(fragID);
        if (!foundFrag) continue;
        const { mesh } = foundFrag;
        edges.styles.list.thick.fragments[fragID] = new Set(thickItems[fragID]);
        edges.styles.list.thick.meshes.add(mesh);
    }

    /* MD
      Creating a style called "thin" for the rest follows the same pattern:
    */

    edges.styles.create("thin", new Set(), world);

    for (const fragID in thinItems) {
        const foundFrag = fragments.list.get(fragID);
        if (!foundFrag) continue;
        const { mesh } = foundFrag;
        edges.styles.list.thin.fragments[fragID] = new Set(thinItems[fragID]);
        edges.styles.list.thin.meshes.add(mesh);
    }

    /* MD
      Finally, let's update the edges to apply these changes.
    */

    await edges.update(true);

    /* MD
      ### 🧩 Adding some UI
      ---

      We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
    */

    BUI.Manager.init();

    /* MD
    Now we will add some UI to control the navigation across floor plans. For more information about the UI library, you can check the specific documentation for it!
    */

    const panel = BUI.Component.create<BUI.PanelSection>(() => {
        return BUI.html`
  <bim-panel active label="Plans Tutorial" class="options-menu">
      <bim-panel-section collapsed name="floorPlans" label="Plan list">
      </bim-panel-section>
    </bim-panel>
    `;
    });

    document.body.append(panel);

    /* MD
      Next, we will add a button for each floor plan, so that when clicking on that button, we navigate to it and the look of the model becomes more "floorplan-like" (black and white with outlines):
    */

    const minGloss = world.renderer!.postproduction.customEffects.minGloss;

    const whiteColor = new THREE.Color("white");

    const panelSection = panel.querySelector(
        "bim-panel-section[name='floorPlans']",
    ) as BUI.PanelSection;

    for (const plan of plans.list) {
        const planButton = BUI.Component.create<BUI.Checkbox>(() => {
            return BUI.html`
      <bim-button checked label="${plan.name}"
        @click="${() => {
                world.renderer!.postproduction.customEffects.minGloss = 0.1;
                highlighter.backupColor = whiteColor;
                classifier.setColor(modelItems, whiteColor);
                world.scene.three.background = whiteColor;
                plans.goTo(plan.id);
                culler.needsUpdate = true;
            }}">
      </bim-button>
    `;
        });
        panelSection.append(planButton);
    }

    /* MD
      Finally, we will add a last button to exit the floor plan mode, going back to the 3D view and making the appearance of the scene go back to normal.
    */

    const defaultBackground = world.scene.three.background;

    const exitButton = BUI.Component.create<BUI.Checkbox>(() => {
        return BUI.html`
      <bim-button checked label="Exit"
        @click="${() => {
            highlighter.backupColor = null;
            highlighter.clear();
            world.renderer!.postproduction.customEffects.minGloss = minGloss;
            classifier.resetColor(modelItems);
            world.scene.three.background = defaultBackground;
            plans.exitPlanView();
            culler.needsUpdate = true;
        }}">
      </bim-button>
    `;
    });

    panelSection.append(exitButton);

    /* MD
      ### 🎉 Wrap up
      ---

      That's it! You have created an app that can generate all the floorplans of a BIM model and navigate across them in 2D mode with a nice black and white look. Congratulations!
    */
}
ss().then(r => console.log(r))
