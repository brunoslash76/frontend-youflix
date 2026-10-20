import { RouterProvider } from "react-router/dom"
import { Snackbar } from "./modules/videos/presentation/components/organisms/snackbar.component"
import { router } from "./shared/router"

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Snackbar />
    </>
  )
}

export default App
