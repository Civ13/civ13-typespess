declare namespace NodeJS {
	type Tserver = any;
	type Tworld = any;
	interface Global {
		Tserver: Tserver;
		Tworld: Tworld;
		is_bs_editor_env: boolean;
		is_test_env: boolean;
		workspaceDir: string;
		server_version: string = "0.0.0";
		client_version: string = "0.0.0";
		min_client_version: number = 0;
	}
}

interface Element {
	style: any;
	tabIndex: any;
	dataset: any;
	focus: any;
	getContext: any;
}

interface EventTarget {
	localName: any;
	id: any;
}

interface HTMLElement {
	value: any;
	disabled: boolean;
}

interface ChildNode {
	classList: any;
	dataset: any;
	innerHTML: string;
}
