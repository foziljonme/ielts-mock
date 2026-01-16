// // src/middleware/requireAuth.ts
// import { getSession } from '@/lib/auth'

// export const requireAuth =
//   (handler) => async (req, res) => {
//     const user = await getSession(req)
//     if (!user) {
//       return res.status(401).json({ message: 'Unauthorized' })
//     }

//     req.user = user
//     return handler(req, res)
//   }
