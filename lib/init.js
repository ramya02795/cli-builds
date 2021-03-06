"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
require("symbol-observable");
// symbol polyfill must go first
// tslint:disable-next-line:ordered-imports import-groups
const fs = require("fs");
const path = require("path");
const semver_1 = require("semver");
const stream_1 = require("stream");
const color_1 = require("../utilities/color");
const config_1 = require("../utilities/config");
// Check if we need to profile this CLI run.
if (process.env['NG_CLI_PROFILING']) {
    let profiler;
    try {
        profiler = require('v8-profiler-node8'); // tslint:disable-line:no-implicit-dependencies
    }
    catch (err) {
        throw new Error(`Could not require 'v8-profiler-node8'. You must install it separetely with ` +
            `'npm install v8-profiler-node8 --no-save'.\n\nOriginal error:\n\n${err}`);
    }
    profiler.startProfiling();
    const exitHandler = (options) => {
        if (options.cleanup) {
            const cpuProfile = profiler.stopProfiling();
            fs.writeFileSync(path.resolve(process.cwd(), process.env.NG_CLI_PROFILING || '') + '.cpuprofile', JSON.stringify(cpuProfile));
        }
        if (options.exit) {
            process.exit();
        }
    };
    process.on('exit', () => exitHandler({ cleanup: true }));
    process.on('SIGINT', () => exitHandler({ exit: true }));
    process.on('uncaughtException', () => exitHandler({ exit: true }));
}
(async () => {
    var _a;
    /**
     * Disable Browserslist old data warning as otherwise with every release we'd need to update this dependency
     * which is cumbersome considering we pin versions and the warning is not user actionable.
     * `Browserslist: caniuse-lite is outdated. Please run next command `npm update`
     * See: https://github.com/browserslist/browserslist/blob/819c4337456996d19db6ba953014579329e9c6e1/node.js#L324
     */
    process.env.BROWSERSLIST_IGNORE_OLD_DATA = '1';
    const disableVersionCheckEnv = process.env['NG_DISABLE_VERSION_CHECK'];
    /**
     * Disable CLI version mismatch checks and forces usage of the invoked CLI
     * instead of invoking the local installed version.
     */
    const disableVersionCheck = disableVersionCheckEnv !== undefined &&
        disableVersionCheckEnv !== '0' &&
        disableVersionCheckEnv.toLowerCase() !== 'false';
    if (disableVersionCheck) {
        return (await Promise.resolve().then(() => require('./cli'))).default;
    }
    let cli;
    try {
        // No error implies a projectLocalCli, which will load whatever
        // version of ng-cli you have installed in a local package.json
        const projectLocalCli = require.resolve('@angular/cli', { paths: [process.cwd()] });
        cli = await Promise.resolve().then(() => require(projectLocalCli));
        // This was run from a global, check local version.
        if (await config_1.isWarningEnabled('versionMismatch')) {
            const globalVersion = new semver_1.SemVer(require('../package.json').version);
            // Older versions might not have the VERSION export
            let localVersion = (_a = cli.VERSION) === null || _a === void 0 ? void 0 : _a.full;
            if (!localVersion) {
                try {
                    localVersion = require(path.join(path.dirname(projectLocalCli), '../../package.json'))
                        .version;
                }
                catch (error) {
                    // tslint:disable-next-line no-console
                    console.error('Version mismatch check skipped. Unable to retrieve local version: ' + error);
                }
            }
            let shouldWarn = false;
            try {
                shouldWarn = !!localVersion && globalVersion.compare(localVersion) > 0;
            }
            catch (error) {
                // tslint:disable-next-line no-console
                console.error('Version mismatch check skipped. Unable to compare local version: ' + error);
            }
            if (shouldWarn) {
                const warning = `Your global Angular CLI version (${globalVersion}) is greater than your local ` +
                    `version (${localVersion}). The local Angular CLI version is used.\n\n` +
                    'To disable this warning use "ng config -g cli.warnings.versionMismatch false".';
                // tslint:disable-next-line no-console
                console.error(color_1.colors.yellow(warning));
            }
        }
    }
    catch (_b) {
        // If there is an error, resolve could not find the ng-cli
        // library from a package.json. Instead, include it from a relative
        // path to this script file (which is likely a globally installed
        // npm package). Most common cause for hitting this is `ng new`
        cli = await Promise.resolve().then(() => require('./cli'));
    }
    if ('default' in cli) {
        cli = cli['default'];
    }
    return cli;
})().then(cli => {
    // This is required to support 1.x local versions with a 6+ global
    let standardInput;
    try {
        standardInput = process.stdin;
    }
    catch (e) {
        process.stdin = new stream_1.Duplex();
        standardInput = process.stdin;
    }
    return cli({
        cliArgs: process.argv.slice(2),
        inputStream: standardInput,
        outputStream: process.stdout,
    });
}).then((exitCode) => {
    process.exit(exitCode);
})
    .catch((err) => {
    // tslint:disable-next-line no-console
    console.error('Unknown error: ' + err.toString());
    process.exit(127);
});
