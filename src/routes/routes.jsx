import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { TaskManagerHome } from "../Components/task-manager-home";
import { UserLogin } from "../Components/user-login";
import { UserDashBoard } from "../Components/user-dashboard";


const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children:[
            {
                index:true,
                element: <TaskManagerHome/>
            },
            {
                path:'login',
                element: <UserLogin width='w-25'/>
            }
        ]
    },
    {
        path:'dashboard',
        element: <UserDashBoard/>
    }
])

export default router;