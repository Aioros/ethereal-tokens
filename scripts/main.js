const MODULE_ID = "ethereal-tokens";
const ignoreWallsFlagKey = "ignoreWalls";

Hooks.on("init", () => {
    libWrapper.register(
        MODULE_ID,
        "foundry.canvas.placeables.Token.prototype._getDragConstrainOptions",
        function(wrapped) {
            const unconstrainedMovement = wrapped();
            const ignoreWallsFlagValue = this.document.getFlag(MODULE_ID, ignoreWallsFlagKey) ?? false;
            unconstrainedMovement.ignoreWalls ||= ignoreWallsFlagValue;
            return unconstrainedMovement;
        },
        "WRAPPER"
    );
});

function addOptions(app, html, context, options) {
    const document = app.isPrototype ? app.actor.prototypeToken : app.document;
    const value = document.getFlag(MODULE_ID, ignoreWallsFlagKey) ?? false;
    const name = `flags.${MODULE_ID}.${ignoreWallsFlagKey}`;

    const input = foundry.applications.fields.createCheckboxInput({ name, value });
    const group = foundry.applications.fields.createFormGroup({
        input,
        label: "ETHEREAL_TOKENS.Options.Token.ignoreWalls",
        hint: "ETHEREAL_TOKENS.Options.Token.ignoreWallsHint",
        localize: true
    });
    const identityTab = html.querySelector(`.tab[data-group="sheet"][data-tab="identity"]`);
    identityTab.append(group);
    app.setPosition();
}

Hooks.on("renderTokenConfig", addOptions);
Hooks.on("renderPrototypeTokenConfig", addOptions);
