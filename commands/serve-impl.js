"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServeCommand = void 0;
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const architect_command_1 = require("../models/architect-command");
class ServeCommand extends architect_command_1.ArchitectCommand {
    constructor() {
        super(...arguments);
        this.target = 'serve';
    }
    validate(_options) {
        return true;
    }
    async run(options) {
        return this.runArchitectTarget(options);
    }
}
exports.ServeCommand = ServeCommand;
