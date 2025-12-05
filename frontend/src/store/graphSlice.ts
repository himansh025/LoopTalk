import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: {
        nodes: [],
        edges: [],
    } ,
    loading: false,
    error: null,
};

const graphSlice = createSlice({
    name: "graph",
    initialState,
    reducers: {
        setGraphData: (state, action) => {
            state.data = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        addNode: (state, action) => {
            state.data.nodes.push(action.payload as never);
        },
        addEdge: (state, action) => {
            state.data.edges.push(action.payload as never);
        },
    },
});

export const { setGraphData, setLoading, setError, addNode, addEdge } = graphSlice.actions;
export default graphSlice.reducer;
