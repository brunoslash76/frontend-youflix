import { HistoryIcon, HomeIcon, UserIcon, VideoIcon } from "lucide-react"
import { Link } from "react-router"

export const MainMenuAsideComponent = () => {
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-primary-ghost z-0 pt-24 px-4">
      <ul>
        <li className="mb-4 hover:bg-primary-light rounded-md p-2">
          <Link to="/" className="flex items-center gap-6">
            <HomeIcon />
            <p>Home</p>
          </Link>
        </li>
        <li className="mb-4 hover:bg-primary-light rounded-md p-2">
          <Link to="/shorts" className="flex items-center gap-6">
            <VideoIcon />
            <p>Shorts</p>
          </Link>
        </li>
        <li className="mb-4 hover:bg-primary-light rounded-md p-2">
          <Link to="/profile" className="flex items-center gap-6">
            <UserIcon />
            <p>You</p>
          </Link>
        </li>
        <li className="mb-4 hover:bg-primary-light rounded-md p-2">
          <Link to="/history" className="flex items-center gap-6">
            <HistoryIcon />
            <p>History</p>
          </Link>
        </li>
        <li className="mb-4 hover:bg-primary-light rounded-md p-2">
          <Link to="/upload" className="flex items-center gap-6">
            <VideoIcon />
            <p>Upload</p>
          </Link>
        </li>
      </ul>
      <div className="border-t border-primary-light" />
    </aside>
  )
}
