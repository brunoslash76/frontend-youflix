import { useGetVideoQuery } from "@/modules/videos/infra/api/video.api"
import { useParams } from "react-router"

export const WatchPage = () => {
  const { publicId } = useParams()
  const { data: video } = useGetVideoQuery(publicId as string)
  return (
    <section className="max-w-2xl py-8 px-4">
      <h1 className="text-3xl font-thin mb-2">Watch video</h1>
      {video && (
        <div className="aspect-video w-full">
          <video src={video.watchUrl} className="w-full h-full object-cover" />
        </div>
      )}
    </section>
  )
}
