import Apify from 'apify';
import { UnknownObject } from './common/types';

export default class Logger {
    resource: { id: string };
    suffix: string;
    logger: typeof Apify.utils.log

    constructor(resource: { id: string }) {
        this.resource = resource;
        this.logger = Apify.utils.log;
    }

    resourceId() {
        return this.resource.id;
    }

    makeLogMessage(icon: string, id: string, message: string) {
        return `${icon} (${id}${this.suffix ? `:${this.suffix}` : ''})  ${message}`;
    };

    cloneWithSuffix(suffix: string) {
        const logger = new Logger({ id: this.resource.id });
        logger.resource = this.resource;
        logger.suffix = suffix;
        return logger;
    }

    start(message: string, data?: UnknownObject) {
        this.logger.info(this.makeLogMessage('[>]', this.resourceId(), message), data);
    }

    end(message: string, data?: UnknownObject) {
        this.logger.info(this.makeLogMessage('[<]', this.resourceId(), message), data);
    }

    info(message: string, data?: UnknownObject) {
        this.logger.info(this.makeLogMessage('[i]', this.resourceId(), message), data);
    }

    db(message: string, data?: UnknownObject) {
        this.logger.info(this.makeLogMessage('[db]', this.resourceId(), message), data);
    }

    warning(message: string, data?: UnknownObject) {
        this.logger.error(this.makeLogMessage('[?]', this.resourceId(), message), data);
    }

    error(message: string, data?: UnknownObject) {
        this.logger.error(this.makeLogMessage('[!]', this.resourceId(), message), data);
    }
};
