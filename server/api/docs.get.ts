import { specs } from '~/server/utils/swagger'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/json')
  return specs
}) 