import { toast } from 'sonner'

export const toastError = ({
  title,
  error,
}: {
  title?: string
  error: any
}) => {
  console.log('errrrrrrrrr', title, error)
  toast.error(title || error?.response?.data?.error?.message || 'Error', {
    description: error?.response?.data?.error?.details || error?.message,
  })
}
