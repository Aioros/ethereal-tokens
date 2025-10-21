const MODULE_ID = "ethereal-tokens";
const ignoreWallsFlagKey = "ignoreWalls";

Hooks.on("init", () => {
    // Removes drag/drop constraint, marginally cleaner but keyboard movement is unaffected
    //libWrapper.register(
    //    MODULE_ID,
    //    "foundry.canvas.placeables.Token.implementation.prototype._getDragConstrainOptions",
    //    function(wrapped) {
    //        const unconstrainedMovement = wrapped();
    //        const ignoreWallsFlagValue = this.document.getFlag(MODULE_ID, ignoreWallsFlagKey) ?? false;
    //        unconstrainedMovement.ignoreWalls ||= ignoreWallsFlagValue;
    //        return unconstrainedMovement;
    //    },
    //    "WRAPPER"
    //);

    // Removes drag/drop and keyboard constraints
    libWrapper.register(
        MODULE_ID,
        "foundry.canvas.placeables.Token.implementation.prototype.constrainMovementPath",
        function(wrapped, waypoints, options) {
            const ignoreWallsFlagValue = this.document.getFlag(MODULE_ID, ignoreWallsFlagKey) ?? false;
            options.ignoreWalls ||= ignoreWallsFlagValue;
            options.ignoreTokens ||= ignoreWallsFlagValue; // for dnd5e
            return wrapped(waypoints, options);
        },
        "WRAPPER"
    );
});

function addOptions(app, html, context, options) {
    const document = app.isPrototype ? app.actor.prototypeToken : app.document;
    const ignoreWallsFlagValue = document.getFlag(MODULE_ID, ignoreWallsFlagKey) ?? false;
    const name = `flags.${MODULE_ID}.${ignoreWallsFlagKey}`;

    const input = foundry.applications.fields.createCheckboxInput({ name, value: ignoreWallsFlagValue });
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
