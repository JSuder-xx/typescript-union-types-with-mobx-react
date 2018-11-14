/** 
 * Partition an array with type-guard/refinment. 
 */
export function partition<TOne, TOther>(items: (TOne | TOther)[], isOne: (item: (TOne | TOther)) => item is TOne): [TOne[], TOther[]] {
    const itemsOfTypeOne: TOne[] = [];
    const itemsOfTypeOther: TOther[] = [];
    const len = items.length;
    for(let idx = 0; idx < len; idx++) {
        const item = items[idx];
        if (isOne(item))
            itemsOfTypeOne.push(item);
        else
            itemsOfTypeOther.push(item);
    }

    return [itemsOfTypeOne, itemsOfTypeOther];
}