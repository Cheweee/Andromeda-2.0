import { useState } from "react";
import { IFilter } from "../models/commonModels";

export function useFilterState(initialFilter: IFilter): [IFilter, (search?: string, debounce?: number) => void] {
    const [debounce, setDebounce] = useState<number>(initialFilter.debounce);
    const [search, setSearch] = useState<string>(initialFilter.search);

    function setState(search?: string, debounce?: number) {
        setDebounce(debounce);
        setSearch(search);
    }

    const filter: IFilter = { debounce, search };
    return [filter, setState];
}