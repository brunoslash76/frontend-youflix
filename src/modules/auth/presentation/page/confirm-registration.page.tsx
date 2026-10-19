import { Logo } from "@/shared/assets/logo"
import { Button } from "@/shared/components/atoms/button.component"
import { useActionState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { useActivateRegistrationMutation } from "../../infra/api/auth.api"

interface ActivateRegistrationState {
  error?: string
  success?: boolean
}

export const ConfirmRegistrationPage = () => {
  const navigate = useNavigate()
  const [activateRegistration, { isLoading }] = useActivateRegistrationMutation()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [, formAction, isPending] = useActionState<ActivateRegistrationState, FormData>(async () => {
    if (!token) return { error: 'Link de ativação inválido' }

    try {
      await activateRegistration({ token }).unwrap()
      navigate('/login', { replace: true, state: { notice: 'Conta ativada! Faça login para continuar.' } })
      return {}
    } catch (error: unknown) {
      const data = (error as { data?: { message?: string | string[], code?: string } })?.data
      if (data?.code === 'ACTIVATION_TOKEN_EXPIRED') {
        navigate('/login', { replace: true, state: { notice: 'Seu link expirou. Faça login para receber um novo.' } })
        return {}
      }
      const message = data?.message
      return { error: (Array.isArray(message) ? message[0] : message) ?? 'Erro ao ativar registro' }
    }
  }, {})

  return (
    <section className="flex flex-col items-center justify-center">
      <form action={formAction} className="flex flex-col gap-4 max-w-md w-full mb-8">
        <Logo />
        <h1 className="text-4xl font-thin mx-auto">Confirmação de Cadastro</h1>
        <p className="text-gray-500">
          Por favor, confirme seu email para continuar.
        </p>
        <Button type="submit" disabled={isPending}>
          {isLoading ? 'Carregando...' : 'Confirmar'}
        </Button>
      </form>
    </section>
  )
}
