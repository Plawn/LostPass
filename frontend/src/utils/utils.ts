
export function range(size:number, startAt:number = 0):ReadonlyArray<number> {
    return [...Array<number>(size).keys()].map(i => i + startAt);
}