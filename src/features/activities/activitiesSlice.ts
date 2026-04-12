import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Activity } from "../../types/Activity";

type ActivitiesState = {
    home: Activity[] | null,
    dashboard: Activity[] | null,
    filter: string
}
const initialState: ActivitiesState = {
    home: null,
    dashboard: null,
    filter: "hosted"
}

const activitiesSlice = createSlice({
    name: "activities",
    initialState,
    reducers: {
        setHomeActivities: (state, action: PayloadAction<Activity[] | null>) => {
            state.home = action.payload
        },
        setDashboardActivities: (state, action: PayloadAction<Activity[] | null>) => {
            state.dashboard = action.payload
        },
        setFilter: (state, action: PayloadAction<string>) => {
            state.filter = action.payload
            // Force a refetch for dashboard activities only when filter changes.
            state.dashboard = null
        },
    },
});

export const { setHomeActivities, setDashboardActivities, setFilter } = activitiesSlice.actions;
export default activitiesSlice.reducer;