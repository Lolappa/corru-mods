(function () {
  // Prepare all masks
  delete env.masks.reality;
  env.masks.unity.modular = true;
  env.masks.hunger.modular = true;
  env.masks.joy.modular = true;
  env.masks.freedom.definition =
    "'enables free movement in spatial thoughtforms';'hold SHIFT for slower movement'";

  // Apply modular masks
  for (const name in env.masks) {
    const maskObj = env.masks[name];
    if (maskObj.modular && check(`mask-${name}`)) {
      mask({ name, retrigger: true, playSound: false, toggle: true });
    }
  }

  let old_check = check;
  check = function (inputKey, inputValue = null) {
    if (inputKey === "mask") {
      if (inputValue !== null) return old_check(`mask-${inputValue}`);
      return "reality";
    }
    return old_check(inputKey, inputValue);
  };

  // Update stuff that checks for "mask" flag

  // globalents.js
  (function () {
    function globalents() {
      env.entities["s w   al kk"].actions[0].showIf = () => !check("mask-joy");
      env.entities["s w   al kk"].actions[1].showIf = () =>
        check("mask-unity") && !check("mask-joy");
      env.entities["s w   al kk"].actions[2].showIf = () => check("mask-joy");
      env.entities["s w   al kk"].actions.push({
        name: "unity",
        class: "act-ozo",
        showIf: () => check("mask-unity") && check("mask-joy"),
        exec: () => {
          chatter({
            actor: "s w   al kk",
            text: "car fix   go plac ess",
            readout: true,
            delay: 2000,
          });

          env.setTimeout(() => {
            play("talkchoir", 0.75);
            vfx({ type: "beacon", state: true });
          }, 400);

          setTimeout(() => {
            vfx({ type: "beacon", state: false });
          }, 2000);
        },
      });
    }
    globalents();
    document.addEventListener("corru_loaded", globalents);
  })();
  // Update files when they are loaded

  let file_overrides = {};
  let page_overrides = {};

  document.addEventListener("corru_resources_added", (e) => {
    console.info("Updating added resources");
    e.detail.resList.forEach((file) => {
      if (file in file_overrides) {
        file_overrides[file]();
      } else {
        console.warn(`Not updating mask checks for ${file}`);
      }
    });

    console.info("Updating page");
    if (page.path.replace(/[\/]*$/, "/") in page_overrides) {
      page_overrides[page.path.replace(/[\/]*$/, "/")]();
    } else {
      console.warn(
        `Not updating mask checks for ${page.path.replace(/[\/]*$/, "/")}`,
      );
    }
  });
  document.addEventListener("corru_loaded", () => {
    update_global_entities();

    console.info("Updating page");
    if (page.path.replace(/[\/]*$/, "/") in page_overrides) {
      page_overrides[page.path.replace(/[\/]*$/, "/")]();
    } else {
      console.warn(
        `Not updating mask checks for ${page.path.replace(/[\/]*$/, "/")}`,
      );
    }
  });

  // File overrides

  // /js/embassy_stages_golem.js
  file_overrides["/js/embassy_stages_golem.js"] = function () {
    env.stages["g_lobby"].entities["τ"].lockExec = function () {
      if (check("mask-hunger") && check("PAGE!!geliawake")) {
        if (check("geli_beacon", false)) {
          startDialogue("geli_beacon_fallback", { force: true });
        } else {
          startDialogue("add2warn", { force: true });
        }
      } else {
        chatter({
          actor: "akizet",
          text: "whatever this was connected to is gone now",
          readout: true,
        });
      }
    };
  };

  // Page overrides

  // /local/city/street/
  page_overrides["/local/city/street/"] = function () {
    env.stages["city_office"].getPlan = function () {
      let plan = this.plans.default;

      if (check("mask-joy")) {
        plan = this.plans.joy;
      }

      return plan;
    };
    env.stages["city_street3"].leaveExec = function () {
      env.citystreet.buttonActive = false;
      clearTimeout(env.citystreet.buttonTimeout);
      env.setTimeout(() => {
        if (env.stage.name != "city_street3" || !check("mask-joy")) {
          env.citystreet.wait.stop();
          env.citystreet.walk.stop();
          env.bgm.rate(1);
          content.classList.remove("hide-envoy");
        }
      }, 50);
    };
    env.stages["city_street3"].getPlan = function () {
      let plan = this.plans.default;

      if (check("mask-joy")) {
        plan = this.plans.joy;
        env.citystreet.buttonActive = true;
      } else {
        env.citystreet.buttonActive = false;
      }

      return plan;
    };
  };

  // /local/ocean/embassy/resources/
  page_overrides["/local/ocean/embassy/resources/"] = function () {
    env.stages["resource_hub"].planAdjustment = function (plan) {
      let newPlan = plan;

      if (!check("e3a2__escapewin") && !location.search.includes("debug"))
        newPlan = newPlan
          .replaceAll("D", ".")
          .replaceAll("d", ".")
          .replaceAll("ð", ".");
      if (!check("e3a2__bstrdmeet") && !location.search.includes("debug"))
        newPlan = newPlan.replaceAll("f", ".");
      if (!env.ep3 && !location.search.includes("debug"))
        newPlan = newPlan.replaceAll("Ď", ".").replaceAll("Đ", ".");

      if (!check("mask-joy")) {
        newPlan = newPlan
          .replaceAll("▒", ".")
          .replaceAll("ç", ".")
          .replaceAll("J", ".")
          .replaceAll("Y", ".")
          .replaceAll("y", ".")
          .replaceAll("j", ".")
          .replaceAll("ĵ", ".")
          .replaceAll("Ĵ", ".");
      }
      if (!check("mask-hunger")) {
        newPlan = newPlan.replaceAll("▓", ".");
      }

      return newPlan;
    };
  };
})();
