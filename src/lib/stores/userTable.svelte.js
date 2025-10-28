export const createUserTableStore = () => {
    
    let state = $state({
        users: [],
        totalItems: 0,
        isLoading: false,
        currentPage: 1,
        pageSize: 10,
        search: '',
        sorting: null,
        initialized: false
    });

     const setPage = (page) => {
        state.currentPage = page;
    };

    const setSearch = (search) => {
        state.search = search;
        state.currentPage = 1;
    };

    const setSort = (sorting) => {
        state.sorting = sorting;
    };

    return {
        get state() {
            return state;
        },
        setPage,
        setSearch,
        setSort,
    };
}
