const TypespessClient = require("./client/index.ts");

const { Eye, Plane } = TypespessClient;
const { ParallaxPlane } = require("./code/parallax.ts");

// Just a small little polyfill for Edge (fuck you edge by the way)

for (const collection_class of [HTMLCollection, NodeList, DOMTokenList]) {
	if (!collection_class.prototype[Symbol.iterator])
		{collection_class.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];}
}

const client = new TypespessClient();

client.importModule(require("./code/alert.ts"));
client.importModule(require("./code/carbon_mob.ts"));
client.importModule(require("./code/hud.ts"));
client.importModule(require("./code/progress_bar.ts"));
client.importModule(require("./code/projectile.ts"));
client.importModule(require("./code/splash_screen.ts"));
client.importModule(require("./code/text_input.ts"));
client.importModule(require("./code/ui/admin_menu.ts"));
client.importModule(require("./code/ui/chem_dispenser.ts"));
client.importModule(require("./code/ui/latejoin.ts"));
client.importModule(require("./code/ui/login.ts"));
client.importModule(require("./code/ui/machine_wires.ts"));
client.importModule(require("./code/ui/new_player.ts"));
client.importModule(require("./code/ui/preferences.ts"));
client.importModule(require("./code/ui/spawn_object.ts"));
client.importModule(require("./code/ui/stack_craft.ts"));
client.importModule(require("./code/ui/strip.ts"));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if(global.is_bs_editor_env) {
	module.exports = client;
} else {
	client.handle_login = function () {
		this.panel_manager.create_client_panel({
			title: "Login",
			can_close: false,
			content_class: "LoginPanel",
			width: 250,
			height: 400,
		});
	};
	require("./code/preload.ts")(client);
	window.addEventListener("load", () => {
		const eye = new Eye(client, "");
		const main_plane = new Plane.World(eye, "");
		main_plane.z_index = 0;
		const ui_plane = new Plane(eye, "ui");
		ui_plane.z_index = 10000;
		const lighting_plane = new Plane.Lighting(eye, "lighting");
		lighting_plane.z_index = 5000;
		const parallax_plane = new ParallaxPlane(eye, "parallax");
		parallax_plane.z_index = 9999;
		eye.canvas = document.getElementById("mainlayer");
		eye.create_click_handlers();
		eye.on("mouse_over_atom_changed", (to) => {
			const doc = document.getElementById("hovering-atom");
			if (doc) {
				if (to) {
					doc.textContent = to.name;
				} else {
					doc.textContent = "";
				}}
		});

		client.login();
	});
}