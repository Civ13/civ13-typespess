module.exports.now = function (client: Record<string,any>) {
	if (global.is_bs_editor_env) {
		module.exports = client;
	}
	window.addEventListener("load", () => {
		const input_elem = document.getElementById("main-text-input");
		document.addEventListener("keydown", (e) => {
			if (typeof input_elem === "undefined" || e.target.localName === "input" || !client.connection)
				{return;}
			// the e.preventDefault() is for stopping the character being typed into the input
			if (e.key === "o") {
				// o
				input_elem.dataset.inputting = "ooc";
				input_elem.focus();
				e.preventDefault();
			} else if (e.key === "t") {
				// t
				input_elem.dataset.inputting = "say";
				input_elem.focus();
				e.preventDefault();
			}
		});
		input_elem.parentElement.addEventListener("click", (e) => {
			if (!e.defaultPrevented) {
				input_elem.blur();
				const div = document.createElement("div");
				div.textContent = "Use 'o' for OOC, and 't' for speech.";
				const cw = document.getElementById("chatwindow");
				let do_scroll = false;
				if (cw.scrollTop + cw.clientHeight >= cw.scrollHeight) {
					do_scroll = true;
				}
				cw.appendChild(div);
				if (do_scroll) {
					cw.scrollTop = cw.scrollHeight - cw.clientHeight;
				}
			}
		});
		input_elem.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				// escape
				input_elem.blur();
				input_elem.dataset.inputting = null;
				input_elem.value = "";
				e.preventDefault();
			} else if (e.key === "Enter") {
				// enter
				if (client.connection && input_elem.dataset.inputting === "ooc") {
					client.connection.send(JSON.stringify({ooc_message: input_elem.value}));
				} else if (client.connection && input_elem.dataset.inputting === "say") {
					client.connection.send(JSON.stringify({say_message: input_elem.value}));
				}

				input_elem.blur();
				input_elem.dataset.inputting = null;
				input_elem.value = "";
				e.preventDefault();
			}
		});
		input_elem.addEventListener("input", () => {
			console.log("here");
			const text = input_elem.value;
			if (text.startsWith(";")) {
				input_elem.classList.add("radio");
			} else {
				input_elem.classList.remove("radio");
			}
		});
	});
};
