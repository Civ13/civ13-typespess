declare namespace NodeJS {
    type Tserver = any;
    type Tworld = any;
    interface Global {
    Tserver: Tserver,
    Tworld: Tworld,
    is_bs_editor_env: boolean,
    }
}
