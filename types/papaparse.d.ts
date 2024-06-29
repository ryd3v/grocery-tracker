declare module 'papaparse' {
    export function parse<T>(input: string | File, config: any): { data: T[], errors: any[], meta: any };

    export function unparse(data: any, config?: any): string;
}
