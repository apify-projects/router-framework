import Apify from 'apify';
import { UnknownObject } from './common/types';

export default class Logger {
    resource: { id: string };
    parents: { id: string }[];
    logger: typeof Apify.utils.log

    constructor(resource: { id: string }) {
        this.resource = resource;
        this.parents = [];
        this.logger = Apify.utils.log;
    }

    trailId() {
        return [...this.parents.map((parent) => parent.id), this.resource.id].join(' > ');
    }

    makeLogMessage(prefix: string, id: string, message: string) {
        return `${prefix} (${id})  ${message}`;
    };

    attachParent(parent) {
        if (parent) this.parents.unshift(parent);
    }

    attachParents(parents = []) {
        this.parents.unshift(...parents);
    }

    start(message: string, data?: UnknownObject) {
        this.logger.info(this.makeLogMessage('[>] ', this.trailId(), message), data);
    }

    end(message: string, data?: UnknownObject) {
        this.logger.info(this.makeLogMessage('[<] ', this.trailId(), message), data);
    }

    info(message: string, data?: UnknownObject) {
        this.logger.info(this.makeLogMessage('[i] ', this.trailId(), message), data);
    }

    db(message: string, data?: UnknownObject) {
        this.logger.info(this.makeLogMessage('[db]', this.trailId(), message), data);
    }

    warning(message: string, data?: UnknownObject) {
        this.logger.error(this.makeLogMessage('[?] ', this.trailId(), message), data);
    }

    error(message: string, data?: UnknownObject) {
        this.logger.error(this.makeLogMessage('[!] ', this.trailId(), message), data);
    }
};
