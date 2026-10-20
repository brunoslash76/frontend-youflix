import { notify } from "@/modules/videos/presentation/hooks/snackbar.store"
import { Logo } from "@/shared/assets/logo"
import { Button } from "@/shared/components/atoms/button.component"
import { Input } from "@/shared/components/atoms/input.component"
import { RotateCcw } from "lucide-react"
import { useActionState, useState } from "react"
import { Link } from "react-router"
import { useRegisterMutation, useValidateUsernameMutation } from "../../infra/api/auth.api"

interface RegisterState {
  error?: string
  success?: boolean
}

export const RegisterPage = () => {
  const [register, { isLoading }] = useRegisterMutation()
  const [validateUsername, {
    isLoading: isValidateUsernameLoading,
    data: validateUsernameData,
    error: validateUsernameError
  }] = useValidateUsernameMutation()
  const [uname, setUsername] = useState('')
  const [state, formAction] = useActionState<RegisterState, FormData>(async (_prev, formData) => {
    const email = String(formData.get('email') ?? '')
    const password = String(formData.get('password') ?? '')
    const passwordConfirmation = String(formData.get('passwordConfirmation') ?? '')
    const phone = String(formData.get('phone') ?? '')
    const firstName = String(formData.get('firstName') ?? '')
    const lastName = String(formData.get('lastName') ?? '')
    const username = String(formData.get('username') ?? '')

    try {
      await register({
        email,
        password,
        passwordConfirmation,
        phone,
        firstName,
        lastName,
        username,
      }).unwrap()
      return { success: true }
    } catch (error: unknown) {
      const message = (error as { data?: { message?: string | string[] } })?.data?.message
      return { error: (Array.isArray(message) ? message[0] : message) ?? 'Erro ao cadastrar' }
    }
  }, {})

  const handleValidateUsername = async () => {
    try {
      const response = await validateUsername({ username: uname }).unwrap()
      if (response.success) {
        notify(`Username ${uname} is available`)
      }
    } catch (e: unknown) {
      const message = (e as { data?: { message?: string | string[] } })?.data?.message
      console.error(message)
      notify(`Username ${uname} is not available`)
    }
  }

  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <form action={formAction} className="flex flex-col gap-4 max-w-md w-full mb-8">
        <Logo />
        <h1 className="text-4xl font-thin mx-auto">Cadastro</h1>
        <div className="flex relative">
          <Input
            type="text"
            name="username"
            className="w-full"
            placeholder="Username"
            value={uname}
            onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
            onBlur={handleValidateUsername}
          />
          <button
            type="button"
            className={`absolute right-3 top-3 cursor-pointer ${isValidateUsernameLoading ? 'animate-spin' : ''}`}
            disabled={isValidateUsernameLoading}
            onClick={handleValidateUsername}
          >
            <RotateCcw className="w-4 h-4" color={validateUsernameData?.success ? 'green' : 'currentColor'} />
          </button>
        </div>
        {validateUsernameError && <p className="text-danger">{validateUsernameError?.data?.message}</p>}
        <Input type="text" name="firstName" placeholder="Nome" />
        <Input type="text" name="lastName" placeholder="Sobrenome" />
        <Input type="email" name="email" placeholder="Email" />
        <Input type="password" name="password" placeholder="Senha" />
        <Input type="password" name="passwordConfirmation" placeholder="Confirmar Senha" />
        <Input type="text" name="phone" placeholder="Telefone" />
        <Button type="submit" disabled={isLoading || !validateUsernameData?.success}>
          {isLoading ? 'Carregando...' : 'Cadastrar'}
        </Button>
      </form>
      {state.error && <p className="text-danger">{state.error}</p>}
      <Link to="/login" className="text-sm text-gray-500">Já tem uma conta? <span className="text-blue-500">Faça login</span></Link>
    </section>
  )
}