export type Zero = 0;

/** Just going to 12... */
export type NonZero = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type SuccType<T extends number> =
    T extends 0 ? 1
    : T extends 1 ? 2
    : T extends 2 ? 3
    : T extends 3 ? 4
    : T extends 4 ? 5
    : T extends 5 ? 6
    : T extends 6 ? 7
    : T extends 7 ? 8
    : T extends 8 ? 9
    : T extends 9 ? 10
    : T extends 10 ? 11
    : T extends 11 ? 12
    : never;

export type SumType<TLeft extends number, TRight extends number> =
    TLeft extends 0 ? TRight
    : TLeft extends 1 ? SuccType<TRight>
    : TLeft extends 2 ? SuccType<SuccType<TRight>>
    : TLeft extends 3 ? SuccType<SuccType<SuccType<TRight>>>
    : TLeft extends 4 ? SuccType<SuccType<SuccType<SuccType<TRight>>>>
    : TLeft extends 5 ? SuccType<SuccType<SuccType<SuccType<SuccType<TRight>>>>>
    : TLeft extends 6 ? SuccType<SuccType<SuccType<SuccType<SuccType<SuccType<TRight>>>>>>
    : TLeft extends 7 ? SuccType<SuccType<SuccType<SuccType<SuccType<SuccType<SuccType<TRight>>>>>>>
    : number;


export const succ = <T extends Zero | NonZero>(num: T): SuccType<T> =>
    <any>(num + 1);

export const sumOfCardinal = <TLeft extends Zero | NonZero, TRight extends Zero | NonZero>(left: TLeft, right: TRight): SumType<TLeft, TRight> => 
    <any>left + right;

export const sum = (left: number, right: number): number =>
    left + right;
