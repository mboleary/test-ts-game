export abstract class Loader<Input, Output, Options> {
    constructor(
        public readonly name: string,
    ) {}

    public abstract validateOptions(options: Options): boolean;

    public abstract run(input: Input, options: Options): Promise<Output>;
}