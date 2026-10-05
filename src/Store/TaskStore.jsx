import { configureStore } from "@reduxjs/toolkit";
import TaskSlicer from "../Slicers/TaskSlicer";


export const taskStore = configureStore({
    reducer: TaskSlicer
})