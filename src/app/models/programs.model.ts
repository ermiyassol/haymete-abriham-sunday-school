import { Members } from './members.model';
import { Mezmur } from './mezmur.model';
import { Temhirt } from './temhirt.model';
import { Message } from './message.model';

export class Programs {
  constructor(
    public start: string,
    public end: string,
    public day: string,
    public date: string,
    public month: string,
    public year: string,
    public description: string,
    public specific_date?: string,
    public key?: string,
    public id?: number,
    public lecture?: Temhirt,
    public song?: Mezmur,
    public members?: Members,
    public message?: Message[]
  ) {}
}
