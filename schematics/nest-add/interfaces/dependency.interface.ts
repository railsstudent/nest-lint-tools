import { NodeDependencyType } from "@schematics/angular/utility/dependencies"

export interface Dependency {
    name: string;
    type: NodeDependencyType;
    version: string;
}