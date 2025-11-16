import { Loader } from "../Loader";

export type CSVLoaderOptions = {
    separator: string;
    lineDelimiter: string;
    columns?: CSVColumnOptions[];
    autoParseColumns?: boolean
};

export enum CSVColumnTypes {
    NUMBER = "number",
    STRING = "string",
    BOOLEAN = "boolean",

}

export type CSVColumnOptions = {
    headerTitle: string,
    key: string,
    type: CSVColumnTypes
}

type CSVColumnProperties = CSVColumnOptions & {
    index: number
};

const defaultOptions = {
    separator: ",",
    lineDelimiter: "\n"
};

export class CSVLoader extends Loader<string, any[], CSVLoaderOptions> {
    constructor() {
        super("csv");
    }
    
    public validateOptions(options: CSVLoaderOptions): boolean {
        return true;
    }

    public run(input: string, optionsParam: CSVLoaderOptions): Promise<any[]> {
        const options = Object.assign({}, defaultOptions, optionsParam);
        
        let columnOptions: CSVColumnOptions[] = options.columns || [];
        const columns: CSVColumnProperties[] = [];
        const rows = input.split(options.lineDelimiter);
        const parsedRows: any[] = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i]
            const cols = row.split(options.separator);
            if (i === 0 && options.autoParseColumns) {
                columnOptions = this.getColumns(row, options.separator);
            }

            if (i === 0) {
                // Find Indexes for Header Row
                for (let j = 0; j < cols.length; j++) {
                    const col = cols[j];

                    const options = columnOptions.find((opt) => opt.headerTitle === col);
                    if (options) {
                        columns.push({index: j, ...options});
                    }
                }
            } else {
                // Use the found columns to get the rest of the data
                const obj: any = {};
                for (const c of columns) {
                    obj[c.key] = cols[c.index];
                }
                parsedRows.push(obj);
            }
        }

        return Promise.resolve(parsedRows);
    }

    private getColumns(headerRow: string, separator: string) {
        return headerRow.split(separator)
            .map((column, index) => ({
                headerTitle: column,
                key: column,
                type: CSVColumnTypes.STRING
            }),
        );
    }
}