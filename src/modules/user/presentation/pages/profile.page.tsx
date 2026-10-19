import { useGetMeQuery } from "@/modules/auth/infra/api/auth.api"
import { EmptyStateWithLoginComponent } from "@/shared/components/molecules/empty-state-with-login.component"

export const ProfilePage = () => {
  const { data: user, isLoading, error } = useGetMeQuery()
  console.error(error)
  if (isLoading) return <div>Loading...</div>
  if(!user) return <EmptyStateWithLoginComponent />
  return (
    <div>
      <h1>Profile</h1>
    </div>
  )
}