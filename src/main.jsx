import { CookiesProvider } from 'react-cookie'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js'
import router from './routes/routes';
import { Provider } from 'react-redux'
import { taskStore } from './Store/TaskStore.jsx'

createRoot(document.getElementById('root')).render(
    <CookiesProvider>
        <Provider store={taskStore}>
        <RouterProvider router={router}/>
        </Provider>
    </CookiesProvider>
)
