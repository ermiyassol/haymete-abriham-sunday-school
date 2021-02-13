export class Library {
    constructor(
    public userName: string,
    public bookCode: string,
    public bookName: string,
    public phone: string,
    public date: string,
    public status: boolean,
    public LName1: string,
    public LName2: string,
    public update: string[],
    public key?: string
    ) {}
}