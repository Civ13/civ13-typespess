class LoginPanel {
	panel: any;
	connection: any;
	constructor(panel: { manager: { client: { connection: any; }; }; }) {
		this.panel = panel;
		this.panel.content_obj.classList.add("center");
		this.panel.header_obj.classList.add("center");
		this.connection = panel.manager.client.connection;
		this.message_handler = this.message_handler.bind(this);
		this.connection.addEventListener("message", this.message_handler);
	}

	message_handler(e: { data: string; }) {
		const obj = JSON.parse(e.data);
		if (obj.login_type === "debug") {
			let div = document.createElement("div");
			div.classList.add("vertical-margins");
			const text_input = document.createElement("input");
			text_input.type = "text";
			text_input.maxLength = 30;
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			text_input.value = localStorage.getItem("debug_username")!;
			text_input.placeholder = "Nickname";
			div.appendChild(text_input);
			this.panel.content_obj.appendChild(div);
			div = document.createElement("div");
			div.classList.add("vertical-margins");
			const button = document.createElement("div");
			button.classList.add("button");
			button.textContent = "Connect";
			button.addEventListener("click", () => {
				localStorage.setItem("debug_username", text_input.value);
				this.connection.send(JSON.stringify({ login: text_input.value }));
				this.login_finish();
			});
			div.appendChild(button);
			this.panel.content_obj.appendChild(div);
		} else if (obj.login_type === "database") {
			console.log(`login: ${obj}`)
			let div = document.createElement("div");
			div.classList.add("vertical-margins");
			const text_input = document.createElement("input");
			text_input.type = "text";
			text_input.maxLength = 30;
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			text_input.placeholder = "Username";
			div.appendChild(text_input);
			const password_input = document.createElement("input");
			password_input.type = "password";
			password_input.maxLength = 30;
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			password_input.placeholder = "Password";
			div.appendChild(password_input);
			this.panel.content_obj.appendChild(div);
			div = document.createElement("div");
			div.classList.add("vertical-margins");
			const button = document.createElement("div");
			button.classList.add("button");
			button.textContent = "Login";
			button.addEventListener("click", () => {
				this.connection.send(JSON.stringify({ name: text_input.value, password: password_input.value }));
				this.login_finish();
			});
			div.appendChild(button);
			this.panel.content_obj.appendChild(div);
		} else if (obj.valid !== undefined) {
			if (obj.valid) {
				this.panel.content_obj.getElementsByClassName(
					"logged-in"
				)[0].style.display = "block";
				this.panel.content_obj.getElementsByClassName(
					"not-logged-in"
				)[0].style.display = "none";
				this.panel.content_obj
					.getElementsByClassName("connect-button")[0]
					.classList.remove("disabled");
				this.panel.content_obj.getElementsByClassName(
					"logged-in-as"
				)[0].textContent = obj.logged_in_as;
				if (obj.autojoin) {
					this.connection.send(JSON.stringify({ login: true }));
					this.login_finish();}
			}} else {
				this.panel.content_obj.getElementsByClassName(
					"logged-in"
				)[0].style.display = "none";
				this.panel.content_obj.getElementsByClassName(
					"not-logged-in"
				)[0].style.display = "block";
				this.panel.content_obj
					.getElementsByClassName("connect-button")[0]
					.classList.add("disabled");
			}
	}

	login_finish() {
		this.connection.removeEventListener("message", this.message_handler);
		this.panel.manager.client.login_finish();
		this.panel.close();
	}
}

module.exports.panel_classes = { LoginPanel };