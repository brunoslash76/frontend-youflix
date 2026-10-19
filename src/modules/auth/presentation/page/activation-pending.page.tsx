import { Logo } from "@/shared/assets/logo"
import { Button } from "@/shared/components/atoms/button.component"
import { useEffect, useState } from "react"
import { Navigate, useLocation, useNavigate } from "react-router"
import { useResendActivationEmailMutation } from "../../infra/api/auth.api"
import { parseSecondsToMinutes } from "../utils/parse-seconds-to-minutes"

export const ActivationPendingPage = () => {
  const [resendActivationEmail] = useResendActivationEmailMutation()
  const email = (useLocation().state as { email?: string } | null)?.email
  const [timeLeft, setTimeLeft] = useState<number>(210)
  const navigate = useNavigate()

  useEffect(() => {
    if (!email) return
    resendActivationEmail({ email })
  }, [email, resendActivationEmail, navigate])

  useEffect(() => {
    if (!email || timeLeft <= 0) return
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, email])

  if (!email) return <Navigate to="/login" replace />

  const handleResend = async () => {
    await resendActivationEmail({ email })
    setTimeLeft(210)
  }

  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <article className="flex flex-col gap-4 max-w-md w-full mb-8">
        <Logo />
        <h1 className="text-4xl font-thin mx-auto">Confirmação de Cadastro</h1>
        <p className="text-gray-500">
          Por favor, confirme seu email para continuar.
        </p>
        <Button type="button" disabled={timeLeft > 0} onClick={handleResend}>
          Enviar novamente em {parseSecondsToMinutes(timeLeft)} segundos
        </Button>
      </article>
    </section>
  )
}