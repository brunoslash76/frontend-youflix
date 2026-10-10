import { Logo } from "@/shared/assets/logo"
import { Button } from "@/shared/components/atoms/button/Button.component"
import { Input } from "@/shared/components/atoms/input/Input.component"
import { useActionState } from "react"
import { Link } from "react-router"
import { useRegisterMutation } from "../../infra/api/auth.api"

interface RegisterState {
  error?: string
  success?: boolean
}

export const RegisterPage = () => {
  const [register, { isLoading }] = useRegisterMutation()

  const [state, formAction,] = useActionState<RegisterState, FormData>(async (_prev, formData) => {
    const email = String(formData.get('email') ?? '')
    const password = String(formData.get('password') ?? '')
    const passwordConfirmation = String(formData.get('passwordConfirmation') ?? '')
    const phone = String(formData.get('phone') ?? '')
    const firstName = String(formData.get('firstName') ?? '')
    const lastName = String(formData.get('lastName') ?? '')

    try {
      await register({ email, password, passwordConfirmation, phone, firstName, lastName }).unwrap()
      return { success: true }
    } catch (error: unknown) {
      const message = (error as { data?: { message?: string | string[] } })?.data?.message
      return { error: (Array.isArray(message) ? message[0] : message) ?? 'Erro ao cadastrar' }
    }
  }, {})

  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <form action={formAction} className="flex flex-col gap-4 max-w-md w-full mb-8">
        <Logo />
        <h1 className="text-4xl font-thin mx-auto">Cadastro</h1>
        <Input type="text" name="firstName" placeholder="Nome" />
        <Input type="text" name="lastName" placeholder="Sobrenome" />
        <Input type="email" name="email" placeholder="Email" />
        <Input type="password" name="password" placeholder="Senha" />
        <Input type="password" name="passwordConfirmation" placeholder="Confirmar Senha" />
        <Input type="text" name="phone" placeholder="Telefone" />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Carregando...' : 'Cadastrar'}
        </Button>
      </form>
      {state.error && <p className="text-danger">{state.error}</p>}
      <Link to="/login" className="text-sm text-gray-500">Já tem uma conta? <span className="text-blue-500">Faça login</span></Link>
    </section>
  )
}