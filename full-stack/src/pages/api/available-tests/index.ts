import { withAuth } from '@/lib/auth/withAuth'
import fs from 'fs/promises'
import path from 'path'
import { NextApiRequest, NextApiResponse } from 'next'

export default withAuth(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
      const readyTestsPath = path.join(
        'src',
        'pages',
        'api',
        'available-tests',
        'ready-tests.json',
      )
      const readyTests = await fs.readFile(readyTestsPath, 'utf-8')
      res.status(200).json(JSON.parse(readyTests))
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  },
  { candidateCanAccess: true },
)
