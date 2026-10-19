import { useLoginMutation } from "@/modules/auth/infra/api/auth.api"
import { Logo } from "@/shared/assets/logo"
import { Button } from "@/shared/components/atoms/button.component"
import { Input } from "@/shared/components/atoms/input.component"
import { useActionState, } from "react"
import { Link, useLocation, useNavigate } from "react-router"

interface LoginState {
  error?: string
  success?: boolean
}

export const LoginPage = () => {
  const navigate = useNavigate()
  const notice = (useLocation().state as { notice?: string } | null)?.notice
  const [login, { isLoading }] = useLoginMutation()
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(async (_prev, formData) => {
    const email = String(formData.get('email') ?? '')
    const password = String(formData.get('password') ?? '')

    try {
      await login({ email, password }).unwrap()
      return { success: true }
    } catch (error: unknown) {
      const data = (error as { data?: { message?: string | string[], code?: string | string[] } })?.data
      
      if (data?.code === 'ACCOUNT_NOT_ACTIVATED') {
        navigate('/activation-pending', { state: { email } })
      }
      return { error: (Array.isArray(data?.message) ? data?.message[0] : data?.message) ?? 'Erro ao fazer login' }
    }
  }, {})

  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <form action={formAction} className="flex flex-col gap-4 max-w-md w-full mb-8">
        <Logo />
        <h1 className="text-4xl font-thin mx-auto">Login</h1>
        <Input type="email" name="email" placeholder="Email" />
        <Input type="password" name="password" placeholder="Senha" />
        <Button type="submit" disabled={isPending}>
          {isLoading ? 'Carregando...' : 'Login'}
        </Button>
      </form>
      {state.error && <p className="text-danger">{state.error}</p>}
      {notice && !state.error && <p className="text-gray-500">{notice}</p>}
      <Link to="/register" className="text-sm text-gray-500">Não tem uma conta? <span className="text-blue-500">Cadastre-se</span></Link>
    </section>
  )
}