// Object used to observe changes on an observable entity

export type UpdateHandlerFunction<T> = (update: T, observer: Observer<T>) => void
export type CloseHandlerFunction = (observer: Observer<any>) => void

export class Observer<T> {
  constructor(
    private readonly watchPath: string,
  ) {}

  private closed: boolean = false;
  private readonly updateHandlers: UpdateHandlerFunction<T>[] = [];
  private readonly closeHandlers: CloseHandlerFunction[] = [];

  public get path(): string {
    return this.watchPath;
  }

  public isClosed(): boolean {
    return this.closed;
  }

  public addUpdateHandler(handler: UpdateHandlerFunction<T>) {
    if (this.updateHandlers.includes(handler)) return;

    this.updateHandlers.push(handler);
  }

  public addCloseHandler(handler: CloseHandlerFunction) {
    if (this.closeHandlers.includes(handler)) return;

    this.closeHandlers.push(handler);
  }

  public removeUpdateHandler(handler: UpdateHandlerFunction<T>): boolean {
    if (this.updateHandlers.includes(handler)) {
      this.updateHandlers.splice(this.updateHandlers.indexOf(handler), 1);
      return true;
    }
    return false;
  }

  public removeCloseHandler(handler: CloseHandlerFunction): boolean {
    if (this.closeHandlers.includes(handler)) {
      this.closeHandlers.splice(this.closeHandlers.indexOf(handler), 1);
      return true;
    }
    return false;
  }

  public notify(data: T): void {
    if (this.closed) {
      throw new Error('Observer is closed');
    }
    for (const h of this.updateHandlers) {
      try {
        h(data,this);
      } catch (err) {
        console.error(err);
        // @TODO handle the error
      }
    }
  }
  
  close() {
    if (this.closed) return;
    for (const h of this.closeHandlers) {
      try {
        h(this);
      } catch (err) {
        console.error(err);
      }
    }
    this.closed = true;
    this.updateHandlers.splice(0, this.updateHandlers.length);
    this.closeHandlers.splice(0, this.closeHandlers.length);
  }
}

