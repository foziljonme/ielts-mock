import { toast } from 'sonner'

export const toastError = ({
  title,
  error,
}: {
  title?: string
  error: any
}) => {
  toast.error(title || error?.response?.data?.error?.message || 'Error', {
    description: error?.response?.data?.error?.details || error?.message,
  })
}
