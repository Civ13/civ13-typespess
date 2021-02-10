declare namespace NodeJS {
    type Tserver = any;
    type Tworld = any;
    interface Global {
        Tserver: Tserver,
        Tworld: Tworld,
        is_bs_editor_env: boolean,
        workspaceDir: string,
    }
}

interface Element {
    style: any,
    tabIndex: any,
    dataset: any,
    focus: any,
    getContext: any,
}

interface EventTarget {
    localName: any,
    id: any,
}