import { Loader2 } from "lucide-react"

export const Loading = () => {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin space-x-4" />
        <p>Loading...</p>
      </div>
    )
}
