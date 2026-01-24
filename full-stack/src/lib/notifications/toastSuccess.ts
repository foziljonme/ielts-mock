import { toast } from 'sonner'

export const toastSuccess = ({
  title,
  message,
}: {
  title: string
  message?: string
}) => {
  toast.success(title, { description: message })
}
