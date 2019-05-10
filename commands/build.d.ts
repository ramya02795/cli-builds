/**
 * Compiles an Angular app into an output directory named dist/ at the given output path.
 * Must be executed from within a workspace directory.
 */
export interface Schema {
    /**
     * **EXPERIMENTAL** Output file path for Build Event Protocol events
     */
    buildEventLog?: string;
    /**
     * A named build target, as specified in the "configurations" section of angular.json.
     * Each named target is accompanied by a configuration of option defaults for that target.
     * Setting this explicitly overrides the "--prod" flag
     */
    configuration?: string;
    /**
     * Shows a help message for this command in the console.
     */
    help?: HelpUnion;
    /**
     * Shorthand for "--configuration=production".
     * When true, sets the build configuration to the production target.
     * By default, the production target is set up in the workspace configuration such that all
     * builds make use of bundling, limited tree-shaking, and also limited dead code elimination.
     */
    prod?: boolean;
    /**
     * The name of the project to build. Can be an app or a library.
     */
    project?: string;
}
/**
 * Shows a help message for this command in the console.
 */
export declare type HelpUnion = boolean | HelpEnum;
export declare enum HelpEnum {
    HelpJson = "JSON",
    Json = "json"
}
