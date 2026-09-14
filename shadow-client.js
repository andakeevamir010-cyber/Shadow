(() => {
    "use strict";

    const STORAGE_KEY = "shadow_client_settings";

    const DEFAULTS = {
        fps: true,
        keystrokes: true,

        fullbright: false,
        freelook: false,
        aimAssist: false,
        autoClicker: false,

        freelookKey: "AltLeft",

        aimMode: "Crosshair",
        aimRange: 4,
        aimSpeed: 3,

        clickCps: 8
    };

    let settings;

    try {
        settings = {
            ...DEFAULTS,
            ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
        };
    } catch {
        settings = { ...DEFAULTS };
    }

    function saveSettings() {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(settings)
        );
    }

    const root = document.createElement("div");
    root.id = "shadow-client";

    root.innerHTML = `
        <div id="shadow-hud"></div>

        <div id="shadow-menu">

            <h1>Shadow Client</h1>

            <div class="shadow-subtitle">
                Minecraft 1.8 WASM-GC
                • Right Shift = Menu
            </div>

            <div id="shadow-mods"></div>

        </div>
    `;

    document.body.appendChild(root);

    const hud = document.getElementById("shadow-hud");
    const menu = document.getElementById("shadow-menu");
    const mods = document.getElementById("shadow-mods");

    function addToggle(name, description, setting) {

        const row = document.createElement("div");
        row.className = "shadow-row";

        const info = document.createElement("div");

        info.innerHTML = `
            <div class="shadow-name">${name}</div>
            <div class="shadow-description">
                ${description}
            </div>
        `;

        const button = document.createElement("button");

        button.className = "shadow-button";

        function update() {

            button.textContent =
                settings[setting] ? "ON" : "OFF";

            button.classList.toggle(
                "enabled",
                settings[setting]
            );
        }

        button.onclick = () => {

            settings[setting] =
                !settings[setting];

            saveSettings();

            update();
        };

        update();

        row.appendChild(info);
        row.appendChild(button);

        mods.appendChild(row);
    }

    function addInput(name, description, setting, type = "text") {

        const row = document.createElement("div");
        row.className = "shadow-row";

        const info = document.createElement("div");

        info.innerHTML = `
            <div class="shadow-name">${name}</div>
            <div class="shadow-description">
                ${description}
            </div>
        `;

        const input = document.createElement("input");

        input.className = "shadow-input";
        input.type = type;
        input.value = settings[setting];

        input.onchange = () => {

            if (type === "number") {
                settings[setting] =
                    Number(input.value);
            } else {
                settings[setting] =
                    input.value;
            }

            saveSettings();
        };

        row.appendChild(info);
        row.appendChild(input);

        mods.appendChild(row);
    }

    function addSelect(name, description, setting, options) {

        const row = document.createElement("div");
        row.className = "shadow-row";

        const info = document.createElement("div");

        info.innerHTML = `
            <div class="shadow-name">${name}</div>
            <div class="shadow-description">
                ${description}
            </div>
        `;

        const select = document.createElement("select");

        select.className = "shadow-select";

        options.forEach(option => {

            const element =
                document.createElement("option");

            element.value = option;
            element.textContent = option;

            if (option === settings[setting]) {
                element.selected = true;
            }

            select.appendChild(element);
        });

        select.onchange = () => {

            settings[setting] =
                select.value;

            saveSettings();
        };

        row.appendChild(info);
        row.appendChild(select);

        mods.appendChild(row);
    }

    /*
     * MOD MENU
     */

    addToggle(
        "FPS Counter",
        "Displays your current FPS.",
        "fps"
    );

    addToggle(
        "Keystrokes + CPS",
        "Displays WASD and left-click CPS.",
        "keystrokes"
    );

    addToggle(
        "Fullbright",
        "Fullbright setting.",
        "fullbright"
    );

    addToggle(
        "FreeLook",
        "FreeLook camera setting.",
        "freelook"
    );

    addInput(
        "FreeLook Key",
        "KeyboardEvent.code used for FreeLook.",
        "freelookKey"
    );

    addToggle(
        "Aim Assist",
        "Configurable target-assist setting.",
        "aimAssist"
    );

    addSelect(
        "Aim Target",
        "Target selection mode.",
        "aimMode",
        [
            "Crosshair",
            "Closest",
            "Nearest"
        ]
    );

    addInput(
        "Aim Range",
        "Maximum target range.",
        "aimRange",
        "number"
    );

    addInput(
        "Aim Speed",
        "Aim rotation speed.",
        "aimSpeed",
        "number"
    );

    addToggle(
        "Auto Clicker",
        "Click automation setting.",
        "autoClicker"
    );

    addInput(
        "Auto Clicker CPS",
        "Clicks per second.",
        "clickCps",
        "number"
    );


    /*
     * MENU KEY
     */

    let menuOpen = false;

    document.addEventListener(
        "keydown",
        event => {

            if (event.code === "ShiftRight") {

                menuOpen = !menuOpen;

                menu.style.display =
                    menuOpen ? "block" : "none";

                event.preventDefault();
            }
        },
        true
    );


    /*
     * KEYSTROKES
     */

    const keys = new Set();

    document.addEventListener(
        "keydown",
        event => {

            keys.add(event.key.toUpperCase());

            if (
                event.code === settings.freelookKey &&
                settings.freelook
            ) {
                window.ShadowFreeLookActive = true;
            }

        },
        true
    );

    document.addEventListener(
        "keyup",
        event => {

            keys.delete(event.key.toUpperCase());

            if (
                event.code === settings.freelookKey
            ) {
                window.ShadowFreeLookActive = false;
            }

        },
        true
    );


    /*
     * CPS
     */

    let clicks = [];

    document.addEventListener(
        "mousedown",
        event => {

            if (event.button === 0) {
                clicks.push(Date.now());
            }

        },
        true
    );


    /*
     * FPS
     */

    let frames = 0;
    let fps = 0;
    let lastFPSUpdate = performance.now();

    function fpsLoop(time) {

        frames++;

        if (time - lastFPSUpdate >= 500) {

            fps =
                frames * 1000 /
                (time - lastFPSUpdate);

            frames = 0;
            lastFPSUpdate = time;

            updateHUD();
        }

        requestAnimationFrame(fpsLoop);
    }

    requestAnimationFrame(fpsLoop);


    /*
     * HUD
     */

    function updateHUD() {

        hud.innerHTML = "";

        if (settings.fps) {

            const box =
                document.createElement("div");

            box.className =
                "shadow-hud-box";

            box.textContent =
                `FPS: ${Math.round(fps)}`;

            hud.appendChild(box);
        }

        if (settings.keystrokes) {

            const box =
                document.createElement("div");

            box.className =
                "shadow-hud-box";

            const keyboard =
                document.createElement("div");

            keyboard.id =
                "shadow-keystrokes";

            [
                "",
                "W",
                "",
                "A",
                "S",
                "D"
            ].forEach(key => {

                const element =
                    document.createElement("div");

                element.className =
                    "shadow-key";

                element.textContent =
                    key;

                if (keys.has(key)) {
                    element.classList.add("active");
                }

                keyboard.appendChild(element);
            });

            box.appendChild(keyboard);

            clicks =
                clicks.filter(
                    time =>
                        Date.now() - time < 1000
                );

            const cps =
                document.createElement("div");

            cps.style.marginTop = "4px";

            cps.textContent =
                `CPS: ${clicks.length}`;

            box.appendChild(cps);

            hud.appendChild(box);
        }
    }


    /*
     * PUBLIC SHADOW CLIENT API
     */

    window.ShadowClient = {

        getSettings() {
            return { ...settings };
        },

        isEnabled(mod) {
            return !!settings[mod];
        },

        isFreeLookActive() {
            return !!window.ShadowFreeLookActive;
        },

        getAimSettings() {
            return {
                mode: settings.aimMode,
                range: settings.aimRange,
                speed: settings.aimSpeed
            };
        }

    };

    updateHUD();

})();
