import { Logo } from "@/shared/assets/logo"
import { Link } from "react-router"

interface ModalAfterRegisterDialogComponentProps {
  open: boolean
  close: () => void
}

export const ModalAfterRegisterDialogComponent = ({ open, close }: ModalAfterRegisterDialogComponentProps) => {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 bg-primary/50 flex items-center justify-center"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="activation-notice-title"
        className="max-w-lg rounded-xl bg-primary-ghost p-6 shadow-lg flex flex-col items-center gap-4"
        onClick={(event) => event.stopPropagation()}
      >
        <Logo />
        <h2
          id="activation-notice-title"
          className="text-3xl font-bold"
        >
          Confirme seu e-mail
        </h2>
        <p className="text-center">
          Enviamos um e-mail para você ativar a conta. Abra a mensagem e confirme o cadastro para entrar.
        </p>
        <Link to="/login">
          Ir para login
        </Link>
        <button
          type="button"
          className="bg-info text-primary-foreground px-4 py-2 rounded-md"
          onClick={close}
        >
          Entendi
        </button>
      </div>
    </div>
  )
}