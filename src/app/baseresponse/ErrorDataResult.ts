﻿import { DataResult } from "./DataResult";

export class ErrorDataResult<T> extends DataResult<T> {
    constructor(data?: T, message?: string) {
        super(data !== undefined ? data : null, false, message || "");
    }
}
