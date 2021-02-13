import { Sex } from './sex.model';

export class Members {
  constructor(
    public status: boolean,
    public absent: Sex,
    public present: Sex,
    public permission: Sex
  ) {}
}
