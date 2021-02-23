declare namespace NodeJS {
	type Tserver = any;
	type Tworld = any;
	interface Global {
		Tserver: Tserver;
		Tworld: Tworld;
		is_bs_editor_env: boolean;
		is_test_env: boolean;
		workspaceDir: string;
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
