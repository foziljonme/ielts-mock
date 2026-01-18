import { validate } from '@/lib/api/validate'
import { withAuth } from '@/lib/auth/withAuth'
import userService from '@/services/user.service'
import { updateUserSchema } from '@/validators/user.schema'
import { NextApiRequest, NextApiResponse } from 'next'

export default withAuth(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { userId } = req.query
    const user = await userService.getUserById(userId as string)
    res.status(200).json(user)
  } else if (req.method === 'PATCH') {
    const { userId } = req.query
    const updateUserData = validate(updateUserSchema, req.body)
    const user = await userService.updateUser(userId as string, updateUserData)
    res.status(200).json(user)
  } else if (req.method === 'DELETE') {
    const { userId } = req.query
    const user = await userService.deleteUser(userId as string)
    res.status(200).json(user)
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
})
