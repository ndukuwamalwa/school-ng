import { Message } from 'primeng/api';

export class MessageEssentials {
    static warn(summary: string, detail: string): Message {
        return {
            severity: 'warn',
            summary,
            detail
        };
    }

    static success(summary: string = 'Successful', detail: string = 'Operation successful'): Message {
        return {
            severity: 'success',
            summary,
            detail
        };
    }

    static info(summary: string, detail: string): Message {
        return {
            severity: 'info',
            summary,
            detail
        };
    }

    static error(summary: string, detail: string): Message {
        return {
            severity: 'error',
            summary,
            detail
        };
    }
}
