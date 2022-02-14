import Apify from 'apify';
import { UnknownObject } from './common/types';
export default class Logger {
    resource: {
        id: string;
    };
    parents: {
        id: string;
    }[];
    logger: typeof Apify.utils.log;
    constructor(resource: {
        id: string;
    });
    trailId(): string;
    makeLogMessage(prefix: string, id: string, message: string): string;
    attachParent(parent: any): void;
    attachParents(parents?: any[]): void;
    start(message: string, data?: UnknownObject): void;
    end(message: string, data?: UnknownObject): void;
    info(message: string, data?: UnknownObject): void;
    db(message: string, data?: UnknownObject): void;
    warning(message: string, data?: UnknownObject): void;
    error(message: string, data?: UnknownObject): void;
}
//# sourceMappingURL=logger.d.ts.map