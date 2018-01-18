import { Collection, Engine, Schematic } from '@angular-devkit/schematics';
import { FileSystemCollectionDesc, FileSystemSchematicDesc, NodeModulesEngineHost } from '@angular-devkit/schematics/tools';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/map';
export declare function getEngineHost(): NodeModulesEngineHost;
export declare function getEngine(): Engine<FileSystemCollectionDesc, FileSystemSchematicDesc>;
export declare function getCollection(collectionName: string): Collection<any, any>;
export declare function getSchematic(collection: Collection<any, any>, schematicName: string): Schematic<any, any>;
